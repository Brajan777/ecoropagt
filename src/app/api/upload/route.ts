import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const BUCKET_NAME = 'ecoropa-media';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dataUrl, folder = 'prendas' } = body as {
      dataUrl?: string;
      folder?: string;
    };

    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Formato de imagen inválido.' },
        { status: 400 }
      );
    }

    // Extraer mime y bytes desde el Data URL comprimido
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ url: dataUrl, storage: 'inline' });
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Límite de seguridad: 2 MB post-compresión
    if (buffer.byteLength > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen supera el límite permitido de 2MB.' },
        { status: 413 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const ext = mimeType.includes('webp')
          ? 'webp'
          : mimeType.includes('png')
          ? 'png'
          : 'jpg';
        const safeFolder = folder === 'closets' ? 'closets' : 'prendas';
        const filePath = `${safeFolder}/${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;

        // Intentar subir al bucket gratuito de Supabase Storage
        let { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, buffer, {
            contentType: mimeType,
            cacheControl: '31536000',
            upsert: false,
          });

        // Si el bucket aún no existe y tenemos permisos, crearlo automáticamente
        if (uploadError && /bucket not found/i.test(uploadError.message)) {
          await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 2097152,
          });
          const retry = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, buffer, {
              contentType: mimeType,
              cacheControl: '31536000',
              upsert: false,
            });
          uploadError = retry.error;
        }

        if (!uploadError) {
          const { data: pub } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

          if (pub?.publicUrl) {
            return NextResponse.json({
              url: pub.publicUrl,
              storage: 'supabase-storage',
            });
          }
        }
      } catch {
        // Fallback automático a WebP ultraligero en línea si el bucket no tiene política pública aún
      }
    }

    return NextResponse.json({
      url: dataUrl,
      storage: 'inline-webp',
    });
  } catch {
    return NextResponse.json(
      { error: 'Error procesando la imagen.' },
      { status: 500 }
    );
  }
}
