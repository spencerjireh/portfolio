/**
 * Minimal Markdown-to-HTML renderer.
 * Supports: **bold**, *italic*, `code`, fenced code blocks, [links](url),
 * unordered lists (- / *), ordered lists (1.).
 * All text is HTML-escaped before processing. Links validated to http(s):// only.
 */

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, ch => ESC[ch]);
}

function processInline(line: string): string {
  // Bold **text**
  line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic *text* (but not inside <strong>)
  line = line.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  // Inline code `text`
  line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links [text](url) -- only http(s) URLs
  line = line.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return line;
}

export function renderMarkdown(raw: string): string {
  const escaped = escapeHtml(raw);
  const lines = escaped.split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const cls = lang ? ` class="language-${lang}"` : '';
      out.push(`<pre><code${cls}>${codeLines.join('\n')}</code></pre>`);
      continue;
    }

    // Unordered list (- or * at start)
    if (/^[\-\*]\s/.test(line)) {
      out.push('<ul>');
      while (i < lines.length && /^[\-\*]\s/.test(lines[i])) {
        out.push(`<li>${processInline(lines[i].replace(/^[\-\*]\s/, ''))}</li>`);
        i++;
      }
      out.push('</ul>');
      continue;
    }

    // Ordered list (1. 2. etc.)
    if (/^\d+\.\s/.test(line)) {
      out.push('<ol>');
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        out.push(`<li>${processInline(lines[i].replace(/^\d+\.\s/, ''))}</li>`);
        i++;
      }
      out.push('</ol>');
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    out.push(`<p>${processInline(line)}</p>`);
    i++;
  }

  return out.join('');
}
