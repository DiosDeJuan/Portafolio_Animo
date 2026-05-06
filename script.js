// Elementos base para animaciones y estado de UI
const progressBar = document.getElementById('scrollBar');
const revealItems = document.querySelectorAll('.reveal');
const parallaxItems = document.querySelectorAll('.parallax');
const videoButtons = document.querySelectorAll('[data-video-index]');
const videos = document.querySelectorAll('.video-frame video');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// Actualiza la barra de progreso al hacer scroll
const updateScrollProgress = () => {
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(percentage, 100)}%`;
};

// Muestra secciones con efecto suave al entrar en viewport
const initReveal = () => {
  if (reducedMotionQuery.matches) {
    revealItems.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach(item => observer.observe(item));
};

// Parallax leve para cadenas decorativas
const initParallax = () => {
  if (reducedMotionQuery.matches) return;

  const applyParallax = () => {
    const currentY = window.scrollY;
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.dataset.speed || '0.08');
      item.style.setProperty('--parallax-y', `${currentY * speed}px`);
    });
  };

  window.addEventListener('scroll', applyParallax, { passive: true });
  applyParallax();
};

// Controla reproducción/pausa de videos de muestra
const initVideoButtons = () => {
  videoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.videoIndex);
      if (!Number.isInteger(index) || index < 0 || index >= videos.length) return;

      const currentVideo = videos[index];
      if (currentVideo.paused) {
        currentVideo.play();
        button.textContent = '❚❚';
      } else {
        currentVideo.pause();
        button.textContent = '▶';
      }
    });
  });
};

// Inicialización general
initReveal();
initParallax();
initVideoButtons();
updateScrollProgress();

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);

// Respeta cambios de accesibilidad (reduced motion)
reducedMotionQuery.addEventListener('change', () => {
  window.location.reload();
});
