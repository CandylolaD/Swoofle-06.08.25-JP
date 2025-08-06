(() => {
  // WICHTIG: Nur auf Startseite oder index.html ausführen
  const isHomepage = window.location.pathname === '/' || 
                     window.location.pathname.includes('index.html') ||
                     window.location.pathname === '';

  if (!isHomepage) return;

  // Header-Element prüfen
  const header = document.querySelector('header.header');
  if (!header) return;

  console.log('🏠 Homepage detected - Initializing sticky header functionality');

  // Stelle sicher, dass der Header initial versteckt ist
  header.style.top = '-100px';
  header.style.opacity = '0';
  header.style.background = 'transparent';
  header.style.boxShadow = 'none';
  header.style.borderBottom = 'none';
  header.style.backdropFilter = 'none';
  header.style.webkitBackdropFilter = 'none';

  // Funktion: Scrollstatus prüfen und Klasse setzen
  const toggleStickyHeader = () => {
    if (window.scrollY > 50) { // Erhöht auf 50px für besseren Effekt
      header.classList.add('header-visible');
      
      // Zusätzliche Inline-Styles für bessere Kontrolle
      header.style.top = '0';
      header.style.opacity = '1';
      header.style.background = 'rgba(255, 255, 255, 0.2)';
      header.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
      header.style.borderBottom = '1px solid var(--border-light)';
      header.style.backdropFilter = 'blur(4px)';
      header.style.webkitBackdropFilter = 'blur(4px)';
      
      console.log('📜 Header shown');
    } else {
      header.classList.remove('header-visible');
      
      // Zurück zur versteckten Position
      header.style.top = '-100px';
      header.style.opacity = '0';
      header.style.background = 'transparent';
      header.style.boxShadow = 'none';
      header.style.borderBottom = 'none';
      header.style.backdropFilter = 'none';
      header.style.webkitBackdropFilter = 'none';
      
      console.log('📜 Header hidden');
    }
  };

  // Scroll-Event binden mit Throttling für bessere Performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        toggleStickyHeader();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Event Listener hinzufügen
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial check nach kurzer Verzögerung
  setTimeout(() => {
    toggleStickyHeader();
  }, 100);

  console.log('✅ Header scroll functionality initialized');
})();