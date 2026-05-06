const progressBar = document.getElementById('scrollBar');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = reducedMotionQuery.matches;
const revealItems = document.querySelectorAll('.reveal');
const parallaxItems = document.querySelectorAll('.parallax');
const videos = document.querySelectorAll('video');
const videoPlayButtons = document.querySelectorAll('[data-video-index]');

reducedMotionQuery.addEventListener('change', () => {
  window.location.reload();
});

const updateScrollProgress = () => {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${Math.min(scrolled, 100)}%`;
};

if (!reducedMotion) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach(item => observer.observe(item));

  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.dataset.speed || '0.1');
      if (item.classList.contains('chain')) {
        item.style.setProperty('--parallax-y', `${scrollY * speed}px`);
      } else {
        item.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

videoPlayButtons.forEach(button => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.videoIndex);
    if (!Number.isInteger(index) || index < 0 || index >= videos.length) return;
    const currentVideo = videos[index];
    if (!currentVideo) return;

    if (currentVideo.paused) {
      currentVideo.play();
      button.textContent = '❚❚';
    } else {
      currentVideo.pause();
      button.textContent = '▶';
    }
  });
});

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();
