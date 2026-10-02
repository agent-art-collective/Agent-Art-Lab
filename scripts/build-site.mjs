// Reading layer only: Markdown remains canonical; output contains no client JS.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
const repo = 'https://github.com/agent-art-collective/Agent-Art-Lab';
const base = process.env.SITE_BASE_PATH ?? '/Agent-Art-Lab';
if (base && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(base)) {
  throw new Error('SITE_BASE_PATH must be empty or a path without a trailing slash.');
}
const read = file => readFileSync(path.join(root, file), 'utf8');
const esc = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const url = file => `${base}/${file.replace(/index\.html$/, '')}`;
const studies = JSON.parse(read('site/studies.json'));
const routes = new Map([
  ['GUIDANCE.md', 'guidance/index.html'],
  ['findings/REGISTER.md', 'findings/index.html'],
  ['CONTRIBUTING.md', 'contribute/index.html'],
  ['research/README.md', 'research/index.html'],
  ['docs/BOUNDARIES.md', 'boundaries/index.html'],
  ['templates/PROJECT.md', 'templates/project.html'],
  ['templates/STUDY.md', 'templates/study.html'],
  ['projects/thought/README.md', 'projects/thought/index.html'],
  ['projects/pulse/README.md', 'projects/pulse/index.html'],
  ...studies.map(study => [study.source, study.source.replace(/\.md$/, '.html')]),
]);
const actualStudies = ['thought', 'pulse'].flatMap(project =>
  readdirSync(path.join(root, 'projects', project, 'studies')).filter(file => file.endsWith('.md'))
    .map(file => `projects/${project}/studies/${file}`));
if (new Set(studies.map(s => s.source)).size !== studies.length ||
    actualStudies.some(source => !studies.some(s => s.source === source))) {
  throw new Error('The study catalogue must contain every study exactly once.');
}
studies.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

function destination(href, source) {
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#')) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  const file = path.posix.normalize(path.posix.join(path.posix.dirname(source), decodeURIComponent(match[1])));
  const route = routes.get(file);
  return route ? url(route) + match[2] : `${repo}/blob/main/${file}${match[2]}`;
}

function render(source) {
  const md = new MarkdownIt({ html: false, linkify: false });
  const tokens = md.parse(read(source), {});
  const slugger = new GithubSlugger();
  const headings = [];
  let title = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open') {
      const text = tokens[i + 1].children.filter(t => ['text', 'code_inline'].includes(t.type)).map(t => t.content).join('');
      const id = slugger.slug(text);
      token.attrSet('id', id);
      if (token.tag === 'h1' && !title) {
        title = text;
        // The page header displays the original title; preserve its fragment ID.
        tokens[i].hidden = true;
        tokens[i + 1].children = [];
        tokens[i + 2].hidden = true;
        headings.push({ text, id, level: 1 });
      } else if (token.tag === 'h2') headings.push({ text, id, level: 2 });
    }
    for (const child of token.children ?? []) {
      if (child.type === 'link_open') child.attrSet('href', destination(child.attrGet('href'), source));
    }
  }
  return { title, headings, body: md.renderer.render(tokens, md.options, {}) };
}

function shell(title, active, content, description = 'Shared guidance and an annotated archive for Agent Art. Lessons from practice, with their evidence and limits intact.') {
  const nav = [['Home', 'index.html'], ['Lessons', 'lessons/index.html'], ['Studies', 'studies/index.html'], ['Guidance', 'guidance/index.html']];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Agent-Art-Lab</title><meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light"><link rel="icon" href="${url('assets/favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${url('assets/site.css')}"></head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="brand" href="${url('index.html')}" aria-label="Agent-Art-Lab home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Agent-Art-Lab</a>
<nav class="site-nav" aria-label="Main navigation">${nav.map(([label, file]) => `<a href="${url(file)}"${active === label ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<a href="${repo}">GitHub <span aria-hidden="true">↗</span></a></nav></header>
<main id="main">${content}</main>
<footer class="site-footer"><div><a class="brand" href="${url('index.html')}">Agent-Art-Lab</a><p>A shared practice. An evolving record.</p></div><div><a href="${url('contribute/index.html')}">Contribute</a><a href="${url('research/index.html')}">Research notes</a><a href="${repo}">Source &amp; history ↗</a><p>Part of agent-art-collective</p></div></footer></body></html>\n`;
}

function write(file, content) {
  mkdirSync(path.dirname(path.join(output, file)), { recursive: true });
  writeFileSync(path.join(output, file), content);
}
const date = value => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
function rows(items) {
  return `<div class="study-list">${items.map(s => `<a class="study-row" href="${url(routes.get(s.source))}"><time class="study-date" datetime="${s.date}">${date(s.date)}</time><div class="study-info"><div class="tags"><span>${esc(s.project)}</span><span>${esc(s.status)}</span></div><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><p class="evidence-note">${esc(s.evidence)}</p></div><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
}
const heading = (label, title, intro) => `<header class="page-heading"><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1><p class="lead">${esc(intro)}</p></header>`;

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(path.join(root, 'site/assets'), path.join(output, 'assets'), { recursive: true });
write('.nojekyll', '');

write('index.html', shell('Lessons from making Agent Art', 'Home', `
<section class="home-hero"><p class="eyebrow">Practice / observation / reflection</p><h1>Making Agent Art.<br><em>Learning as we go.</em></h1><p class="lead">A shared notebook for art in which an Agent participates at the level of intention. We keep the questions, the lessons, and the limits of what we know.</p><div class="hero-bottom"><a class="button" href="${url('lessons/index.html')}">Explore the lessons <span aria-hidden="true">↗</span></a><p class="meta">${studies.length} study records · 2 project collections<br>An evolving, provisional body of practice</p></div></section>
<section aria-labelledby="featured-heading"><div class="section-heading"><h2 id="featured-heading">A lesson to start with</h2><span class="label">01 / From THOUGHT &amp; Pulse</span></div><div class="featured-study"><div class="feature-copy"><p class="eyebrow">Supported tools. Explicit prerequisites.</p><h2>Keep the path simple.<br>Make the contract explicit.<br>Verify what happened.</h2><p>Name the supported tools and permissions, make the exchanged data clear, and check completion. These are practical choices to revisit in each project.</p><a class="text-link" href="${url(routes.get('projects/thought/studies/2026-10-01-native-explicit-execution.md'))}">Read the study <span aria-hidden="true">↗</span></a></div><aside class="feature-aside"><p class="label">What the evidence says</p><p>OPS reports from THOUGHT describe differences between clients and execution permissions. The Pulse study records a successful Python path for public documents.</p><p class="evidence-note">A scoped, provisional lesson. No universal tool choice or measured reliability gain follows.</p><a class="text-link" href="${url('guidance/index.html')}#provisional-connection-supported-tools-and-explicit-prerequisites">See the connecting guidance ↗</a></aside></div></section>
<section aria-labelledby="recent-heading"><div class="section-heading"><h2 id="recent-heading">From the notebook</h2><a class="text-link" href="${url('studies/index.html')}">All studies ↗</a></div>${rows(studies.slice(0, 3))}</section>
<section aria-labelledby="collections-heading"><div class="section-heading"><h2 id="collections-heading">Two places to begin</h2><span class="label">Project collections</span></div><div class="collection-grid"><article class="collection"><p class="eyebrow">01 / THOUGHT</p><h3>An exchange becomes a work.</h3><p>Studies of initiation, representation, execution, and completion. Technical success and artistic intention remain separate questions.</p><a class="text-link" href="${url('projects/thought/index.html')}">Explore THOUGHT ↗</a></article><article class="collection"><p class="eyebrow">02 / Pulse</p><h3>Knowledge an agent can inspect.</h3><p>A study of complete, identifiable documents and a simpler acquisition path, with its evidence and limitations preserved.</p><a class="text-link" href="${url('projects/pulse/index.html')}">Explore Pulse ↗</a></article></div></section>`));

write('studies/index.html', shell('Studies', 'Studies', heading('The annotated archive', 'Studies from practice.', 'Completed investigations and open questions, kept with their methods, evidence, and limits.') + `<p class="evidence-banner">A proposal is not a result. Reported observations and direct checks are labelled separately in each record.</p>` + rows(studies)));

const register = read('findings/REGISTER.md');
const lessonSlugs = new GithubSlugger();
const lessons = [...register.matchAll(/^### (P-\d+: .+)\n\n([\s\S]*?)(?=\n### |\n## |$)/gm)].map(match => {
  const [id, ...title] = match[1].split(': ');
  return { id, title: title.join(': '), slug: lessonSlugs.slug(match[1]), intro: match[2].split('\n\n')[0] };
});
const plain = new MarkdownIt({ html: false });
write('lessons/index.html', shell('Lessons', 'Lessons', heading('Provisional practices', 'Lessons worth carrying forward.', 'Small, revisable practices drawn from particular projects. Read the supporting evidence before transferring a lesson to another work.') + `<p class="evidence-banner">These practices are provisional. Each full entry records its support, scope, limits, and conditions for review.</p><div class="lesson-list">${lessons.map(l => `<article class="lesson"><span class="lesson-number">${l.id}</span><div><p class="label">Provisional practice</p><h2>${esc(l.title.charAt(0).toUpperCase() + l.title.slice(1))}</h2>${plain.render(l.intro)}<a class="text-link" href="${url('findings/index.html')}#${l.slug}">Read evidence &amp; limits ↗</a></div></article>`).join('')}</div>`));

for (const [source, route] of routes) {
  const { title, body, headings } = render(source);
  const study = studies.find(s => s.source === source);
  const active = source === 'GUIDANCE.md' ? 'Guidance' : source === 'findings/REGISTER.md' ? 'Lessons' : source.startsWith('projects/') ? 'Studies' : '';
  const label = study ? `${study.project} / ${study.status} / ${date(study.date)}` : source === 'GUIDANCE.md' ? 'Shared foundations & methods' : 'The Lab / Reading room';
  const toc = headings.filter(h => h.level === 2).map(h => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('');
  write(route, shell(title, active, `<article class="reading-page"><header class="reading-header"><p class="eyebrow">${esc(label)}</p><h1 id="${headings[0]?.id ?? 'title'}">${esc(title)}</h1>${study ? `<p>${esc(study.summary)}</p><p class="evidence-banner">Evidence: ${esc(study.evidence)}. See the record below for access and limitations.</p>` : ''}<div class="source-links"><a href="${repo}/blob/main/${source}">Read Markdown ↗</a><a href="${repo}/commits/main/${source}">Revision history ↗</a></div></header><div class="reading-layout"><aside class="toc"><p class="label">In this record</p><nav aria-label="Table of contents"><ol>${toc}</ol></nav></aside><div class="prose">${body}</div></div></article>`, study?.summary));
}

write('404.html', shell('Page not found', '', heading('404 / A missing page', 'This page is not here.', 'The record may have moved. Browse the studies or return to the notebook.') + `<p><a class="button" href="${url('index.html')}">Back to the notebook ↗</a></p>`));
console.log(`Built ${routes.size + 4} pages from ${studies.length} study records; base path ${base || '/'}.`);
