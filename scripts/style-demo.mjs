// One review page: three visual directions using the same Lab sources.
export function renderStyleDemo({ basePath, agentPrompt, lesson, studies, documentCount }) {
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const url = file => `${basePath}/${file.replace(/index\.html$/, '')}`;
  const directions = [
    { id: 'field-notes', number: '01', name: 'Field Notes', short: 'A journal of a shared practice.',
      description: 'Warm paper, literary typography and quiet annotations. The Lab feels like a notebook you can return to, with room for careful reading.',
      fit: 'Best for reflective essays and sustained reading.', tradeoff: 'A quieter expression of the experimental side.', eyebrow: 'A notebook, kept in public', agent: 'An invitation to your agent' },
    { id: 'signal-room', number: '02', name: 'Signal Room', short: 'A clear interface to the evidence.',
      description: 'Dark graphite, sharp lime and a precise information grid. Sources, study status and agent access become the organizing structure.',
      fit: 'Best for a research and technical audience.', tradeoff: 'More instrument-like; less intimate.', eyebrow: 'Practice / evidence / revision', agent: 'Agent reading interface' },
    { id: 'open-studio', number: '03', name: 'Open Studio', short: 'An art space that shares its process.',
      description: 'Cobalt, pale mint and confident, oversized type. An expressive graphic composition gives the archive the presence of an art institution.',
      fit: 'Best for a public-facing Agent Art identity.', tradeoff: 'Long studies need a quieter reading layout.', eyebrow: 'Art is a question we share', agent: 'Bring your own agent' },
  ];
  const agentCard = direction => `<aside class="agent-card" aria-labelledby="${direction.id}-agent-heading">
    <p class="agent-kicker">${direction.agent}</p><h4 id="${direction.id}-agent-heading">Read with your agent.</h4>
    <p class="agent-intro">Copy this prompt, paste it into your agent, then add your question.</p>
    <div class="agent-actions"><button class="copy-prompt" type="button" data-copy-prompt="${direction.id}-prompt" hidden>Copy prompt <span aria-hidden="true">⧉</span></button><a href="${url('agent-access/index.html')}">How it works ↗</a></div>
    <pre class="prompt-text" id="${direction.id}-prompt" tabindex="0" aria-label="Prompt for your agent">${esc(agentPrompt)}</pre>
    <p class="copy-status" role="status" aria-live="polite">The full prompt is also selectable.</p>
    <a class="document-link" href="${url('agent-index.json')}">${documentCount} complete documents · Document index ↗</a>
  </aside>`;
  const records = studies.slice(0, 2).map(study => `<a class="record-row" href="${url(study.source.replace(/\.md$/, '.html'))}"><span>${esc(study.project)} / ${esc(study.date)}</span><h5>${esc(study.title)} <span aria-hidden="true">↗</span></h5><small>${esc(study.evidence)}</small></a>`).join('');
  const preview = direction => `<div class="site-preview ${direction.id}">
    <header class="preview-nav"><a class="preview-brand" href="${url('index.html')}"><span class="preview-mark" aria-hidden="true"></span>Agent-Art-Lab</a><nav aria-label="${direction.name} preview navigation"><a href="${url('lessons/index.html')}">Lessons</a><a href="${url('studies/index.html')}">Studies</a><a href="${url('guidance/index.html')}">Guidance</a></nav></header>
    <div class="preview-hero"><div class="preview-lead"><p class="theme-eyebrow">${direction.eyebrow}</p><h3>Making Agent Art.<br><em>Learning as we go.</em></h3><p class="preview-summary">A shared notebook for art in which an Agent participates at the level of intention. We keep the questions, the lessons, and the limits of what we know.</p>
      ${direction.id === 'open-studio' ? '<div class="studio-art" aria-hidden="true"><span class="art-orbit"></span><span class="art-disc"></span><span class="art-line"></span><span class="art-cross">+</span></div><p class="art-caption">Intention × encounter × reflection</p>' : ''}
      <div class="lead-actions"><a class="theme-link" href="${url('lessons/index.html')}">Explore the lessons <span aria-hidden="true">↗</span></a><p class="preview-meta">${studies.length} studies · 2 project collections<br>A provisional body of practice</p></div></div>${agentCard(direction)}</div>
    <div class="preview-content"><article class="sample-lesson"><p class="theme-eyebrow">A lesson to carry forward / ${esc(lesson.id)}</p><h4>${esc(lesson.title.charAt(0).toUpperCase() + lesson.title.slice(1))}</h4><p>${esc(lesson.intro.replace(/\s+/g, ' '))}</p><a class="theme-link" href="${url('findings/index.html')}#${lesson.slug}">Read the evidence &amp; limits ↗</a></article><section class="sample-index" aria-label="Recent studies"><p class="theme-eyebrow">From the notebook</p>${records}</section></div>
    <footer class="preview-footer"><span>Shared guidance. An evolving record.</span><a href="${url('agent-index.json')}">For agents: document index ↗</a></footer>
  </div>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>Three visual directions · Agent-Art-Lab</title><meta name="description" content="Compare three visual directions for Agent-Art-Lab: Field Notes, Signal Room and Open Studio."><link rel="alternate" type="application/json" title="Agent document index" href="${url('agent-index.json')}"><link rel="stylesheet" href="${url('assets/style-demo.css')}"><link rel="icon" href="${url('assets/favicon.svg')}" type="image/svg+xml"></head>
<body class="demo-page"><a class="skip-link" href="#main">Skip to the directions</a><header class="demo-topbar"><a href="${url('index.html')}">Agent-Art-Lab <span>/ Design review</span></a><a href="${url('index.html')}">Back to the Lab ↗</a></header>
<main id="main"><header class="demo-intro"><p class="demo-kicker">Visual directions / 01—03</p><h1>Three directions.<br>One shared practice.</h1><p>Same lessons. Same evidence. Same invitation to your agent.<br>Three ways the Lab could look and feel.</p></header>
<nav class="direction-index" aria-label="Compare visual directions">${directions.map(d => `<a href="#${d.id}" class="index-${d.id}"><span>${d.number}</span><strong>${d.name}</strong><small>${d.short}</small><i aria-hidden="true">↓</i></a>`).join('')}</nav>
${directions.map(d => `<section class="direction" id="${d.id}" aria-labelledby="${d.id}-heading"><div class="direction-heading"><span class="direction-number">${d.number}</span><div><h2 id="${d.id}-heading">${d.name}</h2><p>${d.description}</p></div><div class="direction-fit"><p>${d.fit}</p><p>${d.tradeoff}</p></div></div>${preview(d)}<a class="back-to-options" href="#main">Back to the three directions ↑</a></section>`).join('')}
<footer class="demo-outro"><h2>Which feels like the Lab?</h2><p>Choose a direction, or name the elements you want to combine. These are working visual proposals; the reading site keeps its current theme until a direction is chosen.</p><div><a href="${url('index.html')}">Current reading site ↗</a><a href="${url('agent-index.json')}">Document index (JSON) ↗</a></div></footer></main>
<script src="${url('assets/style-demo.js')}" defer></script></body></html>\n`;
}
