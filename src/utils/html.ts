const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&apos;': "'",
  '&#39;': "'",
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&rsquo;': "'",
  '&lsquo;': "'",
  '&rdquo;': '"',
  '&ldquo;': '"',
  '&ndash;': '-',
  '&mdash;': '-',
  '&hellip;': '...',
};

function decodeHtmlEntities(value: string) {
  return value.replace(
    /&(?:amp|apos|#39|gt|lt|nbsp|quot|rsquo|lsquo|rdquo|ldquo|ndash|mdash|hellip);/g,
    (match) => HTML_ENTITY_MAP[match] ?? match,
  );
}

export function htmlToPlainText(value?: string | null) {
  if (!value) {
    return '';
  }

  const normalizedBlocks = value
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n\n')
    .replace(/<\s*li[^>]*>/gi, '\n- ')
    .replace(/<\/\s*li\s*>/gi, '')
    .replace(/<\/\s*(div|h1|h2|h3|h4|h5|h6)\s*>/gi, '\n\n');

  const strippedTags = normalizedBlocks.replace(/<[^>]+>/g, ' ');
  const decoded = decodeHtmlEntities(strippedTags);

  return decoded
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
