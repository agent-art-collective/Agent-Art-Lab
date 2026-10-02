// Optional copy buttons; every preview and full prompt is readable without JS.
for (const button of document.querySelectorAll('[data-copy-prompt]')) {
  const prompt = document.getElementById(button.dataset.copyPrompt);
  const status = button.closest('.agent-card').querySelector('.copy-status');
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = 'Copying…';
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      status.textContent = 'Copied. Paste it into your agent, then add your question.';
    } catch {
      prompt.focus();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Copy the selected prompt manually.';
    } finally {
      button.disabled = false;
    }
  });
  button.hidden = false;
}
