// Page transitions and interactions
(function() {
  // No initial body hide; loader is hidden by default

  // THEME TOGGLER
  function applyTheme(theme) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', normalized);
    try { localStorage.setItem('theme', normalized); } catch (e) {}
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = normalized === 'light' ? 'Light' : 'Dark';
  }

  function initTheme() {
    let theme = 'light';
    try { theme = localStorage.getItem('theme') || theme; } catch (e) {}
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    applyTheme(theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Intercept internal link clicks for a smoother transition
  document.addEventListener('click', function(event) {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const isSameOrigin = url.origin === window.location.origin;
    const isNewTab = link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (isSameOrigin && !isNewTab) {
      event.preventDefault();
      document.body.classList.add('is-leaving');
      const loader = document.getElementById('page-loader');
      if (loader) loader.classList.remove('hidden');
      // Navigate after the transition
      const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
      setTimeout(function() { window.location.href = link.href; }, delay);
    }
  });

  // Index: toggle channels list on title click
  document.addEventListener('DOMContentLoaded', function() {
    const title = document.getElementById('main-title');
    const channelList = document.getElementById('channel-list');
    const subtitle = document.querySelector('.subtitle');
    if (title && channelList) {
      title.addEventListener('click', function() {
        const willShow = channelList.classList.contains('hidden');
        channelList.classList.toggle('hidden');

        if (willShow) {
          // Prepare container for entrance animation
          // Force reflow so transitions apply after removing .hidden
          // eslint-disable-next-line no-unused-expressions
          channelList.offsetHeight;
          channelList.classList.add('is-visible');
          if (subtitle) {
            subtitle.classList.remove('animate');
            // reflow to restart animation
            // eslint-disable-next-line no-unused-expressions
            subtitle.offsetHeight;
            subtitle.classList.add('animate');
          }
          // Assign incremental indices for stagger animation
          const chips = channelList.querySelectorAll('.channel-btn');
          chips.forEach(function(chip, index) {
            chip.style.setProperty('--i', index);
          });
          // Trigger reveal animation
          channelList.classList.add('revealed');
        } else {
          // Remove indices when hiding to reset
          const chips = channelList.querySelectorAll('.channel-btn');
          chips.forEach(function(chip) { chip.style.removeProperty('--i'); });
          channelList.classList.remove('revealed');
          channelList.classList.remove('is-visible');
          if (subtitle) subtitle.classList.remove('animate');
        }
      });
    }
  });
})();