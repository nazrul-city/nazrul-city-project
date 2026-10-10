/**
 * Home sections use hash links. Those hashes only exist on `/`.
 * From any other page they must include the home path, such as `/#contact`.
 */
export function resolvePublicHref(href: string, isHome: boolean): string {
  if (href.startsWith('#') && !isHome) {
    return `/${href}`;
  }

  return href;
}
