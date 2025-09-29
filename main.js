const btn  = document.querySelector('.hamburger');
  const menu = document.getElementById('main-menu');

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('noscroll');
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('noscroll', isOpen);
  });

  menu.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });