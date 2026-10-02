import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';

// Markdown paragraph boundaries preserve wrapped lines and exclude support lists.
export function extractLessonExcerpts(markdown) {
  const tokens = new MarkdownIt({ html: false }).parse(markdown, {});
  const lines = markdown.split(/\r\n?|\n/);
  const slugs = new GithubSlugger();
  const lessons = [];
  let pending;
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type === 'heading_open') {
      const text = tokens[index + 1].children.filter(child => ['text', 'code_inline'].includes(child.type))
        .map(child => child.content).join('');
      const slug = slugs.slug(text);
      if (pending && Number(token.tag.slice(1)) <= 3) {
        throw new Error(`${pending.id} has no introductory paragraph`);
      }
      const match = token.tag === 'h3' && text.match(/^(P-\d+): (.+)$/);
      if (match) pending = { id: match[1], title: match[2], slug };
    } else if (pending && token.type === 'paragraph_open' && token.level === 0) {
      const [start, end] = token.map;
      lessons.push({ ...pending, intro: lines.slice(start, end).join('\n') });
      pending = undefined;
    }
  }
  if (pending) throw new Error(`${pending.id} has no introductory paragraph`);
  return lessons;
}
