const GOOGLE_MAPS_EMBED_PREFIX = 'https://www.google.com/maps/embed';

export function isGoogleMapsEmbedUrl(value: string): boolean {
  return value.startsWith(GOOGLE_MAPS_EMBED_PREFIX);
}
