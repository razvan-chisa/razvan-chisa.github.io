import './style.css';
import splashImageUrl from './assets/splash-screen.png';
import architectureDiagramUrl from './assets/Diagram Architecture.png';
import { runTypewriters, typeInto } from './typewriter';

// Matches the moment the `.splash__copy` container has fully faded in
// (see the `fade-up` animation delay + duration in style.css), i.e. after
// the flash / image-reveal intro has played out.
const COPY_VISIBLE_AT_MS = 3750;
const TYPEWRITER_STAGGER_MS = 550;

const copyEl = document.getElementById('splash-copy');
const splashBgImageEl = document.getElementById('splash-bg-image');
const introFlashEl = document.getElementById('intro-flash');
const architectureImageEl = document.getElementById('architecture-image');
const architectureTitleEl = document.getElementById('architecture-title');
const architectureContentEl = document.getElementById('architecture-content');

if (splashBgImageEl instanceof HTMLImageElement) {
  splashBgImageEl.src = splashImageUrl;
}

if (architectureImageEl instanceof HTMLImageElement) {
  architectureImageEl.src = architectureDiagramUrl;
}

if (introFlashEl instanceof HTMLElement) {
  // Once the flash has fully faded out, it has no further visual purpose —
  // remove the whole layer (and its circle) from the DOM rather than leaving
  // a hidden overlay behind. `animationend` bubbles up from the inner circle.
  introFlashEl.addEventListener('animationend', (event) => {
    if (event.animationName === 'flash-fade') {
      introFlashEl.remove();
    }
  });
}

if (copyEl instanceof HTMLElement) {
  window.setTimeout(() => {
    runTypewriters(copyEl, { staggerMs: TYPEWRITER_STAGGER_MS });
  }, COPY_VISIBLE_AT_MS);
}

if (
  architectureTitleEl instanceof HTMLElement &&
  architectureContentEl instanceof HTMLElement
) {
  const titleTextEl = architectureTitleEl.querySelector<HTMLElement>('.typewriter-line__text');
  const titleText = architectureTitleEl.dataset.text ?? '';
  let hasStarted = false;

  const startTitleTypewriter = () => {
    if (!titleTextEl || hasStarted) return;
    hasStarted = true;

    typeInto(titleTextEl, titleText, {
      charDelay: 58,
      jitter: 20,
      onDone: () => {
        architectureTitleEl.classList.add('is-done');
        architectureContentEl.classList.add('is-visible');
      },
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          startTitleTypewriter();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(architectureTitleEl);
  } else {
    startTitleTypewriter();
  }
}
