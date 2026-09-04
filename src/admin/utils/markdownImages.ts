/**
 * Matches `![alt](url "optional title")`, capturing the url only. The cover
 * image is picked from these, so the parse has to agree with what the editor
 * inserts and with what the schema validates against.
 */
const IMAGE_PATTERN =
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;

/**
 * Only absolute http(s) urls count. The editor's own image button inserts a
 * `![image](url)` placeholder, and the API stores the cover verbatim without
 * resolving it — so anything that isn't already a working url would surface as
 * a broken thumbnail here and a broken cover on the public site.
 */
function isUsableImageUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Every usable image url in the markdown body, in order, without duplicates. */
export function extractMarkdownImages(markdown: string | undefined): string[] {
  if (!markdown) return [];

  const urls = [...markdown.matchAll(IMAGE_PATTERN)]
    .map((match) => match[1])
    .filter(isUsableImageUrl);

  return [...new Set(urls)];
}

/** The markdown an upload is appended to the body as. */
export function imageMarkdown(url: string, altText: string): string {
  return `![${altText}](${url})`;
}

/** Filenames make reasonable default alt text, and stay editable in the body. */
export function altTextFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}
