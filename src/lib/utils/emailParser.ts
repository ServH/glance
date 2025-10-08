/**
 * Email parsing utilities for Gmail API responses
 */

/**
 * Extract email address from "From" header
 * Handles formats:
 * - "John Doe <john@example.com>" → "john@example.com"
 * - "john@example.com" → "john@example.com"
 *
 * @param from Raw From header value
 * @returns Email address only
 */
export function parseEmailAddress(from: string): string {
  // Match email in angle brackets
  const angleBracketMatch = from.match(/<(.+?)>/);
  if (angleBracketMatch) {
    return angleBracketMatch[1].trim();
  }

  // No angle brackets - entire string is email
  return from.trim();
}

/**
 * Extract sender name from "From" header
 * "John Doe <john@example.com>" → "John Doe"
 * "john@example.com" → "john@example.com"
 *
 * @param from Raw From header value
 * @returns Sender display name or email if no name
 */
export function parseSenderName(from: string): string {
  const nameMatch = from.match(/^"?(.+?)"?\s*</);
  if (nameMatch) {
    return nameMatch[1].trim().replace(/^"|"$/g, ''); // Remove quotes
  }

  // No name - return email
  return parseEmailAddress(from);
}

/**
 * Decode HTML entities in email snippet
 * &amp; → &, &lt; → <, &gt; → >, &quot; → ", &#39; → '
 *
 * @param text Text with HTML entities
 * @returns Decoded text
 */
export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Truncate snippet to max length with ellipsis
 *
 * @param snippet Raw snippet text (may contain HTML entities)
 * @param maxLength Maximum length before truncation
 * @returns Decoded and truncated snippet
 */
export function truncateSnippet(snippet: string, maxLength: number = 200): string {
  const decoded = decodeHtmlEntities(snippet).trim();

  if (decoded.length <= maxLength) {
    return decoded;
  }

  return decoded.slice(0, maxLength).trim() + '...';
}
