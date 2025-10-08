import { describe, it, expect } from 'vitest';
import {
  parseEmailAddress,
  parseSenderName,
  decodeHtmlEntities,
  truncateSnippet,
} from '../emailParser';

describe('Email Parser', () => {
  describe('parseEmailAddress', () => {
    it('extracts email from angle bracket format', () => {
      expect(parseEmailAddress('John Doe <john@example.com>')).toBe('john@example.com');
    });

    it('handles plain email address', () => {
      expect(parseEmailAddress('john@example.com')).toBe('john@example.com');
    });

    it('handles email with quotes', () => {
      expect(parseEmailAddress('"John Doe" <john@example.com>')).toBe('john@example.com');
    });

    it('handles email with extra whitespace', () => {
      expect(parseEmailAddress('  john@example.com  ')).toBe('john@example.com');
    });

    it('handles complex name with special characters', () => {
      expect(parseEmailAddress('Doe, John (Sales) <john.doe@example.com>')).toBe(
        'john.doe@example.com'
      );
    });
  });

  describe('parseSenderName', () => {
    it('extracts sender name from From header', () => {
      expect(parseSenderName('John Doe <john@example.com>')).toBe('John Doe');
    });

    it('returns email if no name present', () => {
      expect(parseSenderName('john@example.com')).toBe('john@example.com');
    });

    it('removes quotes from name', () => {
      expect(parseSenderName('"John Doe" <john@example.com>')).toBe('John Doe');
    });

    it('handles name with comma', () => {
      expect(parseSenderName('Doe, John <john@example.com>')).toBe('Doe, John');
    });

    it('handles single quoted name', () => {
      expect(parseSenderName("'John Doe' <john@example.com>")).toBe("'John Doe'");
    });
  });

  describe('decodeHtmlEntities', () => {
    it('decodes common HTML entities', () => {
      expect(decodeHtmlEntities('Hello &amp; goodbye')).toBe('Hello & goodbye');
      expect(decodeHtmlEntities('&lt;div&gt;')).toBe('<div>');
      expect(decodeHtmlEntities('&quot;hello&quot;')).toBe('"hello"');
    });

    it('handles text without entities', () => {
      expect(decodeHtmlEntities('Plain text')).toBe('Plain text');
    });

    it('decodes multiple entities in one string', () => {
      expect(decodeHtmlEntities('&lt;p&gt;Hello &amp; welcome&lt;/p&gt;')).toBe(
        '<p>Hello & welcome</p>'
      );
    });

    it('handles apostrophe entity', () => {
      expect(decodeHtmlEntities('It&#39;s working')).toBe("It's working");
    });

    it('handles numeric entities', () => {
      expect(decodeHtmlEntities('&#60;test&#62;')).toBe('<test>');
    });
  });

  describe('truncateSnippet', () => {
    it('truncates long snippets with ellipsis', () => {
      const longText = 'a'.repeat(250);
      const result = truncateSnippet(longText, 200);

      expect(result.length).toBe(203); // 200 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('does not truncate short snippets', () => {
      const shortText = 'Short snippet';
      expect(truncateSnippet(shortText, 200)).toBe(shortText);
    });

    it('decodes HTML entities before truncating', () => {
      const text = '&amp;'.repeat(100); // 500 chars with entities
      const result = truncateSnippet(text, 50);

      expect(result.includes('&amp;')).toBe(false); // Should be decoded
      expect(result.includes('&')).toBe(true);
      expect(result.endsWith('...')).toBe(true);
    });

    it('uses default max length of 200', () => {
      const longText = 'x'.repeat(250);
      const result = truncateSnippet(longText);

      expect(result.length).toBe(203); // 200 + '...'
    });

    it('trims whitespace before adding ellipsis', () => {
      const text = 'a'.repeat(195) + '     '; // 195 chars + spaces = 200 total
      const result = truncateSnippet(text, 200);

      // Text is exactly 200 chars, so no truncation/ellipsis needed
      // Only trailing whitespace should be trimmed
      expect(result).toBe('a'.repeat(195));
    });

    it('handles exactly max length text', () => {
      const text = 'x'.repeat(200);
      const result = truncateSnippet(text, 200);

      // Should NOT add ellipsis if exactly at limit
      expect(result).toBe(text);
      expect(result.endsWith('...')).toBe(false);
    });
  });
});
