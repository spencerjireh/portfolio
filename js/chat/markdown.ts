/**
 * Markdown-to-HTML renderer for chat bubbles.
 * Uses `marked` with GFM (tables, strikethrough, task lists, autolinks).
 * XSS-safe: raw HTML stripped, images disabled, links restricted to https?.
 */

import { Marked, type MarkedExtension, type RendererObject } from 'marked';

const renderer: RendererObject = {
  // Strip raw HTML from LLM output
  html() {
    return '';
  },

  // No images in chat bubbles
  image() {
    return '';
  },

  // Only allow http(s) links; open in new tab
  link({ href, tokens }) {
    const text = (this as any).parser.parseInline(tokens);
    if (!/^https?:\/\//i.test(href)) return text;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  },
};

const options: MarkedExtension = {
  gfm: true,
  breaks: false,
  renderer,
};

const md = new Marked(options);

export function renderMarkdown(raw: string): string {
  return md.parse(raw) as string;
}
