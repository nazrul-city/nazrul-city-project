export function buildWhatsAppHref(phone: string, text?: string): string {
  const href = `https://wa.me/${phone.replace(/\D/g, '')}`;

  return text ? `${href}?text=${encodeURIComponent(text)}` : href;
}
