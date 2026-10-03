// One comparison page; the production blog keeps its selected style.
export function renderStyleDemo({ basePath, slogan, agentPrompt, studies, documentCount }) {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const url = file => `${basePath}/${file.replace(/index\.html$/, '')}`;
  const date = value => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const directions = [
    { id: 'plain-text', number: '01', name: 'Plain-text journal', short: 'One column. Just the writing.', description: 'System type, a narrow column and simple links. No cards or decorative elements.' },
    { id: 'swiss-index', number: '02', name: 'Swiss index', short: 'Dates, type and a precise grid.', description: 'A compact index with a date column, fine rules and one restrained red accent.' },
    { id: 'quiet-editorial', number: '03', name: 'Quiet editorial', short: 'A little warmth. Room to read.', description: 'Warm white, modest serif headings and generous spacing. A quieter version of the current style.' },
  ];
  const articles = studies.slice(0, 3).map(study => `<article class="preview-post">
    <time class="post-date" datetime="${study.date}">${date(study.date)}</time>
    <div class="post-content"><p class="post-meta"><span>${esc(study.project)}</span><span>${esc(study.status)}</span></p>
    <h5><a href="${url(study.source.replace(/\.md$/, '.html'))}">${esc(study.title)}</a></h5>
    <p class="post-summary">${esc(study.summary)}</p><p class="post-evidence">${esc(study.evidence)}</p></div>
  </article>`).join('');
  const preview = direction => `<div class="site-preview ${direction.id}"><div class="preview-inner">
    <header class="preview-nav"><a class="preview-brand" href="${url('index.html')}">Agent-Art-Lab</a><nav aria-label="${direction.name} preview navigation"><a href="${url('index.html')}">Blog</a><a href="https://github.com/agent-art-work/Agent-Art-Lab">GitHub ↗</a></nav></header>
    <header class="preview-intro"><h3>${esc(slogan)}</h3></header>
    <div class="preview-layout"><aside class="agent-card" aria-labelledby="${direction.id}-agent-heading">
      <h4 id="${direction.id}-agent-heading">Read with your agent.</h4><p class="agent-intro">Copy this prompt, then add your question.</p>
      <div class="agent-actions"><button class="copy-prompt" type="button" data-copy-prompt="${direction.id}-prompt" hidden>Copy prompt</button><a href="${url('agent-access/index.html')}">How it works</a></div>
      <pre class="prompt-text" id="${direction.id}-prompt" tabindex="0" aria-label="Prompt for your agent">${esc(agentPrompt)}</pre>
      <p class="copy-status" role="status" aria-live="polite">You can also select and copy the text.</p>
      <a class="document-link" href="${url('agent-index.json')}">${documentCount} complete documents · Agent index ↗</a>
    </aside><section class="preview-feed" aria-labelledby="${direction.id}-articles-heading"><h4 id="${direction.id}-articles-heading">Latest articles</h4><div class="post-list">${articles}</div><a class="more-posts" href="${url('index.html')}#articles">All ${studies.length} articles ↗</a></section></div>
    <footer class="preview-footer"><span>Agent-Art-Lab</span><a href="${url('agent-index.json')}">Document index (JSON)</a></footer>
  </div></div>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>Three minimal directions · Agent-Art-Lab</title><meta name="description" content="Compare Plain-text journal, Swiss index and Quiet editorial for the Agent-Art-Lab blog."><link rel="alternate" type="application/json" title="Agent document index" href="${url('agent-index.json')}"><link rel="stylesheet" href="${url('assets/style-demo.css')}"><link rel="icon" href="${url('assets/favicon.svg?v=dots-2')}" type="image/svg+xml" sizes="any"></head>
<body class="demo-page"><a class="skip-link" href="#main">Skip to the directions</a><header class="demo-topbar"><a href="${url('index.html')}">Agent-Art-Lab</a><a href="${url('index.html')}">Current blog ↗</a></header>
<main id="main"><header class="demo-intro"><h1>Three minimal directions.</h1><p>The same slogan, agent prompt and recent articles in each.</p></header>
<nav class="direction-index" aria-label="Compare minimalist directions">${directions.map(d => `<a href="#${d.id}"><span>${d.number}</span><strong>${d.name}</strong><small>${d.short}</small></a>`).join('')}</nav>
${directions.map(d => `<section class="direction" id="${d.id}" aria-labelledby="${d.id}-heading"><div class="direction-heading"><span class="direction-number">${d.number}</span><h2 id="${d.id}-heading">${d.name}</h2><p>${d.description}</p></div>${preview(d)}<a class="back-to-options" href="#main">Back to the options ↑</a></section>`).join('')}
<footer class="demo-outro"><p>Quiet editorial is now applied to the blog. These previews preserve the three proposed directions.</p><a href="${url('index.html')}">Current blog ↗</a><a href="${url('agent-index.json')}">Document index (JSON) ↗</a></footer></main>
<script src="${url('assets/style-demo.js')}" defer></script></body></html>\n`;
}
