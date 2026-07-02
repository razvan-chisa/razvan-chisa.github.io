import './style.css';
import splashImageUrl from './assets/splash-screen.png';
import { runTypewriters } from './typewriter';

// Matches the moment the `.splash__copy` container has fully faded in
// (see the `fade-up` animation delay + duration in style.css), i.e. after
// the flash / image-reveal intro has played out.
const COPY_VISIBLE_AT_MS = 3750;
const TYPEWRITER_STAGGER_MS = 550;

const copyEl = document.getElementById('splash-copy');
const splashBgImageEl = document.getElementById('splash-bg-image');
const introFlashEl = document.getElementById('intro-flash');

if (splashBgImageEl instanceof HTMLImageElement) {
  splashBgImageEl.src = splashImageUrl;
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
