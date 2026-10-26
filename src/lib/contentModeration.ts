// Verificador automático de texto y moderación preventiva para EcoRopaGT
// Bloquea artículos prohibidos, lenguaje inapropiado, réplicas y datos de contacto externos en títulos, notas y biografías

const FORBIDDEN_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\b(replica|réplica|clon|imitacion|imitación|pirata|triple\s*a|aaa|fake)\b/i,
    reason:
      'En EcoRopaGT no se permiten réplicas, clones ni imitaciones. Solo prendas originales o de marca verificable.',
  },
  {
    pattern: /\b(ropa\s*interior\s*usada|calzon|calzón|boxer\s*usado|tanga|brasier\s*usado|lenceria\s*usada)\b/i,
    reason:
      'Por higiene y políticas sanitarias, no se permite publicar ropa interior usada.',
  },
  {
    pattern: /\b(vape|vaper|cigarro|tabaco|marihuana|droga|medicamento|pastillas|arma|pistola|cuchillo)\b/i,
    reason:
      'Este artículo está estrictamente prohibido en el catálogo familiar de EcoRopaGT.',
  },
  {
    pattern: /\b(estafa|idiota|mierda|puto|puta|imbecil|imbécil|basura|sexo|xxx|onlyfans)\b/i,
    reason:
      'El texto contiene lenguaje ofensivo o inapropiado para nuestra comunidad familiar.',
  },
  {
    pattern: /(\+?\d[\d\s-]{6,15}\d)/,
    reason:
      'Por seguridad, no incluyas números de teléfono ni WhatsApp en títulos, descripciones ni biografías públicas.',
  },
  {
    pattern: /(\S+@\S+\.\S+|https?:\/\/\S+|www\.\S+|wa\.me\/\S+|instagram\.com|facebook\.com|tiktok\.com)/i,
    reason:
      'No se permite incluir enlaces externos, redes sociales ni correos electrónicos en las descripciones.',
  },
];

export interface TextModerationResult {
  valid: boolean;
  reason?: string;
}

export function validateSafeText(...fields: (string | undefined)[]): TextModerationResult {
  const combined = fields.filter(Boolean).join(' ');

  for (const rule of FORBIDDEN_PATTERNS) {
    if (rule.pattern.test(combined)) {
      return {
        valid: false,
        reason: rule.reason,
      };
    }
  }

  return { valid: true };
}

export function sanitizePublicListingText(text: string): string {
  return text
    .replace(/(\+?\d[\d\s-]{6,15}\d)/g, '[contacto oculto]')
    .replace(/\S+@\S+\.\S+/g, '[correo oculto]')
    .replace(/https?:\/\/\S+|www\.\S+|wa\.me\/\S+/gi, '[enlace oculto]');
}
