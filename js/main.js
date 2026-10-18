/* KKM Arkatama — main.js */
(function(){
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Navbar scroll state
  function onScroll(){
    if(window.scrollY > 16) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Navbar auto-hide when footer visible
  const footerEl = document.querySelector('.footer');
  function onFooterScroll(){
    if(!footerEl) return;
    const top = footerEl.getBoundingClientRect().top;
    if(top < window.innerHeight){
      navbar.classList.add('navbar-hidden');
      navbar.classList.remove('navbar-visible');
    } else {
      navbar.classList.remove('navbar-hidden');
      navbar.classList.add('navbar-visible');
    }
  }
  window.addEventListener('scroll', onFooterScroll, {passive:true});
  onFooterScroll();

  function closeMenu(){
    navLinks.classList.remove('open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded','false');
    hamburger.setAttribute('aria-label','Buka menu');
    document.body.style.overflow='';
  }
  // Single toggle hamburger ↔ X
  hamburger.addEventListener('click', ()=>{
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('is-active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on link click
  links.forEach(a=>{
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('click', (e)=>{
    if(!navLinks.classList.contains('open')) return;
    if(navLinks.contains(e.target) || hamburger.contains(e.target)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') closeMenu();
  });

  // Active nav by scroll (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const navMap = {};
  links.forEach(l=>{
    const id = l.getAttribute('href');
    if(id && id.startsWith('#')) navMap[id.slice(1)] = l;
  });
  const ioNav = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(l=>l.classList.remove('active'));
        if(navMap[id]) navMap[id].classList.add('active');
      }
    });
  }, { rootMargin:'-20% 0px -55% 0px', threshold:0 });
  sections.forEach(s=>ioNav.observe(s));

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const ioReveal = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        ioReveal.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
  reveals.forEach(el=>ioReveal.observe(el));
  // Fallback: if IO not supported or already in view on load with delay
  setTimeout(()=>{
    reveals.forEach(el=>{
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.92) el.classList.add('in');
    });
  }, 400);

  // Smooth scroll (enhance native)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(!id || id==='#') return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||68) + 1;
      window.scrollTo({ top, behavior:'smooth' });
      history.pushState(null,'',id);
    });
  });

  // Lucide icons
  if(window.lucide) window.lucide.createIcons();

  // Subtle parallax on hero blobs
  const blobs = document.querySelectorAll('.hero-blob');
  let ticking=false;
  window.addEventListener('scroll', ()=>{
    if(ticking || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ticking=true;
    requestAnimationFrame(()=>{
      const y = window.scrollY * 0.12;
      blobs.forEach((b,i)=>{ b.style.transform = `translateY(${y * (i?0.6:1)}px)`; });
      ticking=false;
    });
  }, {passive:true});

})();
