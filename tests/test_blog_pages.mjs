import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { before, test } from 'node:test';
import MarkdownIt from 'markdown-it';

const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.env.SITE_BASE_PATH ?? '/Agent-Art-Lab';
const read = file => readFileSync(path.join(root, file), 'utf8');
const markdown = new MarkdownIt({ html: false, linkify: false });
const studies = JSON.parse(read('site/studies.json'))
  .sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title));
const route = study => study.source.replace(/\.md$/, '.html');
const href = study => `${base}/${route(study)}`;
const decode = value => value.replace(/&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi,
  entity => markdown.utils.unescapeAll(entity));
const text = html => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const attributes = source => Object.fromEntries([...source.matchAll(/\b([a-z-]+)(?:="([^"]*)")?/g)]
  .map(attribute => [attribute[1], decode(attribute[2] ?? '')]));

// Match known generated tags by nesting depth, so sections inside the hero do
// not falsely end it. This deliberately avoids a new DOM/test dependency.
function elements(html, tag, className) {
  const tokens = new RegExp(`<(/?)${tag}\\b([^>]*)>`, 'g');
  const stack = [];
  const result = [];
  for (const match of html.matchAll(tokens)) {
    if (!match[1]) {
      const attrs = attributes(match[2]);
      stack.push({ attrs, start: match.index, innerStart: match.index + match[0].length });
    } else {
      const item = stack.pop();
      assert.ok(item, `unbalanced generated ${tag}`);
      if (!className || (item.attrs.class ?? '').split(/\s+/).includes(className)) {
        result.push({ ...item, inner: html.slice(item.innerStart, match.index) });
      }
    }
  }
  assert.equal(stack.length, 0, `unclosed generated ${tag}`);
  return result.sort((left, right) => left.start - right.start);
}

function one(html, tag, className) {
  const matches = elements(html, tag, className);
  assert.equal(matches.length, 1, `expected one ${tag}.${className}`);
  return matches[0];
}

function postIdentities(html) {
  return elements(html, 'article', 'post-preview').map(post => {
    const heading = [...elements(post.inner, 'h2'), ...elements(post.inner, 'h3')];
    assert.equal(heading.length, 1, 'each preview has one linked article title');
    const link = one(heading[0].inner, 'a');
    const meta = one(post.inner, 'p', 'post-meta');
    return { title: text(link.inner), href: link.attrs.href, date: one(meta.inner, 'time').attrs.datetime };
  });
}

const expectedPosts = items => items.map(study => ({ title: study.title, href: href(study), date: study.date }));

before(() => {
  const build = spawnSync(process.execPath, ['scripts/build-site.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(build.status, 0, `site build failed:\n${build.stdout}\n${build.stderr}`);
});

test('homepage includes every study in descending record-date and title order', () => {
  const homepage = read('_site/index.html');
  const feed = one(homepage, 'section', 'journal-feed');
  assert.equal(feed.attrs.id, 'articles', 'legacy links land on the single article feed');
  assert.deepEqual(postIdentities(feed.inner), expectedPosts(studies));
});

test('the homepage hero retains exactly one complete canonical agent prompt', () => {
  const homepage = read('_site/index.html');
  assert.equal([...homepage.matchAll(/\bid="agent-prompt"/g)].length, 1);
  const hero = one(homepage, 'section', 'home-hero');
  const prompt = elements(hero.inner, 'pre').filter(item => item.attrs.id === 'agent-prompt');
  assert.equal(prompt.length, 1, 'the prompt remains within the homepage hero');
  const tokens = markdown.parse(read('docs/AGENT_ACCESS.md'), {});
  const heading = tokens.findIndex(token => token.type === 'inline' && token.content === 'A prompt to use');
  assert.notEqual(heading, -1);
  const canonical = tokens.slice(heading + 1).find(token => token.type === 'fence' && token.info === 'text');
  assert.ok(canonical, 'the access guide supplies the canonical prompt');
  assert.equal(decode(prompt[0].inner), canonical.content.replace(/\n$/, ''));
});

test('legacy studies and lessons URLs redirect to the single blog with a visible fallback', () => {
  for (const route of ['studies/index.html', 'lessons/index.html']) {
    const page = read(`_site/${route}`);
    assert.equal(elements(page, 'article', 'post-preview').length, 0, route);
    assert.equal(elements(page, 'div', 'lesson-list').length, 0, route);
    const metas = [...page.matchAll(/<meta\b([^>]*)>/g)].map(match => attributes(match[1]));
    const refresh = metas.filter(meta => meta['http-equiv']?.toLowerCase() === 'refresh');
    assert.equal(refresh.length, 1, route);
    const destination = refresh[0].content?.match(/^\s*0\s*;\s*url=(.+?)\s*$/i);
    assert.ok(destination, `${route} redirects immediately`);
    assert.equal(destination[1], `${base}/#articles`, route);
    const links = [...page.matchAll(/<link\b([^>]*)>/g)].map(match => attributes(match[1]));
    assert.deepEqual(links.filter(link => link.rel === 'canonical').map(link => link.href), [`${base}/`], route);
    const fallback = elements(one(page, 'main').inner, 'a')
      .filter(link => link.attrs.href === `${base}/#articles`);
    assert.ok(fallback.some(link => text(link.inner) && !('hidden' in link.attrs)
      && link.attrs['aria-hidden'] !== 'true'), `${route} has a readable fallback`);
  }
});

test('main navigation has only Blog and GitHub throughout the reading site', () => {
  let checked = 0;
  for (const file of readdirSync(path.join(root, '_site'), { recursive: true }).filter(file => file.endsWith('.html'))) {
    const page = read(`_site/${file}`);
    const navigation = elements(page, 'nav', 'site-nav');
    if (!navigation.length) continue; // The isolated style demonstration has its own controls.
    assert.equal(navigation.length, 1, file);
    const links = elements(navigation[0].inner, 'a');
    assert.deepEqual(links.map(link => link.attrs.href), [`${base}/`, 'https://github.com/agent-art-collective/Agent-Art-Lab'], file);
    assert.equal(text(links[0].inner), 'Blog', file);
    assert.match(text(links[1].inner), /^GitHub\b/, file);
    checked += 1;
  }
  assert.ok(checked > studies.length, 'check the reading pages as well as the articles');
});

test('article pages retain complete source text and identify dates as record dates', () => {
  for (const study of studies) {
    const page = read(`_site/${route(study)}`);
    const article = one(page, 'article', 'blog-article');
    assert.equal(one(article.inner, 'a', 'article-back').attrs.href, `${base}/#articles`, study.source);
    const meta = one(article.inner, 'p', 'article-meta');
    assert.equal(one(meta.inner, 'time').attrs.datetime, study.date, study.source);
    assert.match(text(meta.inner), /Record date:/);
    assert.doesNotMatch(text(meta.inner), /\b(?:published|updated)\b/i);
    assert.ok(text(meta.inner).includes(study.status), `keep the status for ${study.source}`);
    const expected = markdown.render(read(study.source)).replace(/<h1>[\s\S]*?<\/h1>\n?/, '');
    assert.equal(text(one(article.inner, 'div', 'prose').inner), text(expected),
      `retain the complete source body and limits for ${study.source}`);
  }
});

test('adjacent article links follow the catalogue order and stop at both boundaries', () => {
  for (const [index, study] of studies.entries()) {
    const page = read(`_site/${route(study)}`);
    const navigation = one(page, 'nav', 'article-pagination');
    const actual = elements(navigation.inner, 'a').map(link => ({ rel: link.attrs.rel, href: link.attrs.href }));
    const expected = [];
    if (index > 0) expected.push({ rel: 'prev', href: href(studies[index - 1]) });
    if (index < studies.length - 1) expected.push({ rel: 'next', href: href(studies[index + 1]) });
    assert.deepEqual(actual, expected, `adjacent records for ${study.source}`);
  }
});
