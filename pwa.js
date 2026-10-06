(() => {
  const button = document.getElementById('install');
  const panel = document.getElementById('install-panel');
  const help = document.getElementById('install-help');
  const status = document.getElementById('offline-status');
  const standalone = window.matchMedia('(display-mode: standalone)');
  let installPrompt = null;
  function syncInstalled() {
    panel.hidden = standalone.matches || window.navigator.standalone === true;
  }
  syncInstalled();
  standalone.addEventListener('change', syncInstalled);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    help.textContent = 'Install for a home-screen icon and a dedicated app window.';
  });
  button.addEventListener('click', async () => {
    if (!installPrompt) {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      help.textContent = ios
        ? 'On iPhone or iPad, open this page in Safari, tap Share, then Add to Home Screen. Enable Open as Web App if offered.'
        : 'In Chrome on Android, open the browser’s ⋮ menu and choose Add to home screen → Install. If this is an in-app browser, open this page in Chrome first. The automatic prompt may take another visit to become available.';
      return;
    }
    const prompt = installPrompt;
    installPrompt = null;
    button.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      help.textContent = choice.outcome === 'accepted'
        ? 'Installation requested. Look for Baker’s % on your home screen or in your apps.'
        : 'No problem—you can keep using the calculator here or install later from the browser menu.';
    } catch {
      help.textContent = 'Use your browser menu to install or add this calculator to your home screen.';
    } finally {
      button.disabled = false;
    }
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    panel.hidden = true;
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => navigator.serviceWorker.ready)
      .then(() => { status.textContent = 'Ready to use offline.'; })
      .catch(() => { status.textContent = 'Offline setup unavailable. You can still calculate while this page is open.'; });
  }
})();
