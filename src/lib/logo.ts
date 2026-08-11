const extensions = ['svg', 'png', 'jpg'] as const;

export function resolveLogo(logoModules: Record<string, string>, slug: string) {
  return extensions
    .map(
      (extension) =>
        logoModules[`../content/docs/services/${slug}/logo.${extension}`],
    )
    .find(Boolean);
}
