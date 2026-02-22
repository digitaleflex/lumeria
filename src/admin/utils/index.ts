/* ============================================
   ADMIN UTILS - Fonctions utilitaires admin
   ============================================ */

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convertit une chaîne en slug URL-friendly
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Enlève les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplace espaces et underscores par -
    .replace(/^-+|-+$/g, ''); // Enlève les - au début/fin
}

/**
 * Formate un prix
 */
export function formatPrice(price: number, currency: string = '$'): string {
  return `${currency}${price.toLocaleString()}`;
}

/**
 * Tronque un texte
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Formate une date
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formate une date avec heure
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calcule le temps de lecture
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Détecte l'appareil depuis le user agent
 */
export function detectDevice(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

/**
 * Détecte le pays (simplifié - en prod utiliser un service de géoloc)
 */
export function detectCountry(): string {
  // En production, utiliser l'IP ou navigator.language
  const lang = navigator.language || 'en-US';
  if (lang.startsWith('fr')) return 'FR';
  if (lang.startsWith('en-US')) return 'US';
  if (lang.startsWith('en-GB')) return 'GB';
  if (lang.startsWith('de')) return 'DE';
  if (lang.startsWith('es')) return 'ES';
  return 'US';
}

/**
 * Parse les tags depuis une chaîne
 */
export function parseTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * Convertit une chaîne de tags en chaîne affichable
 */
export function stringifyTags(tags: string[]): string {
  return tags.join(', ');
}

/**
 * Valide une URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Génère un lien de tracking avec UTM
 */
export function generateTrackingLink(
  baseUrl: string,
  productId: string,
  params?: { source?: string; campaign?: string; medium?: string }
): string {
  const url = new URL(`${baseUrl}/go/${productId}`);
  if (params?.source) url.searchParams.set('utm_source', params.source);
  if (params?.campaign) url.searchParams.set('utm_campaign', params.campaign);
  if (params?.medium) url.searchParams.set('utm_medium', params.medium);
  return url.toString();
}
