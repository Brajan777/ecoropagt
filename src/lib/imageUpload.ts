// Compresor WebP ultraligero (~35-55 KB por foto) + Subida a Supabase Storage gratuito (1 GB gratis = +20,000 fotos)

export async function compressAndUploadImage(
  file: File,
  folder: 'prendas' | 'closets' = 'prendas',
  maxWidth = 900,
  quality = 0.78
): Promise<string> {
  const compressedDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagen inválida'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Intentar formato WebP (pesa 40% menos que JPEG); si el navegador no soporta WebP, usa JPEG automatically
          const webp = canvas.toDataURL('image/webp', quality);
          if (webp.startsWith('data:image/webp')) {
            resolve(webp);
          } else {
            resolve(canvas.toDataURL('image/jpeg', quality));
          }
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl: compressedDataUrl, folder }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return data.url as string;
      }
    }
  } catch {
    // Si está sin conexión temporal, usa el DataURL WebP comprimido
  }

  return compressedDataUrl;
}
