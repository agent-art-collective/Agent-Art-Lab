// Optional convenience: reading and manual copying work without JavaScript.
const button = document.getElementById('copy-agent-prompt');
const prompt = document.getElementById('agent-prompt');
const status = document.getElementById('prompt-copy-status');

if (button && prompt && status) {
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = 'Copying…';
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      status.textContent = 'Copied. Paste it into your agent, then add your question.';
    } catch {
      prompt.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Copy the selected prompt manually, then paste it into your agent.';
    } finally {
      button.disabled = false;
    }
  });
  button.hidden = false;
}
