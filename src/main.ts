import './style.css';
import splashImageUrl from './assets/splash-screen.png';
import { runTypewriters } from './typewriter';

// Matches the moment the `.splash__copy` container has fully faded in
// (see the `fade-up` animation delay + duration in style.css), i.e. after
// the headlights-approach / flash / image-reveal intro has played out.
const COPY_VISIBLE_AT_MS = 3750;
const TYPEWRITER_STAGGER_MS = 550;

const copyEl = document.getElementById('splash-copy');
const splashBgImageEl = document.getElementById('splash-bg-image');

if (splashBgImageEl instanceof HTMLImageElement) {
  splashBgImageEl.src = splashImageUrl;
}

if (copyEl instanceof HTMLElement) {
  window.setTimeout(() => {
    runTypewriters(copyEl, { staggerMs: TYPEWRITER_STAGGER_MS });
  }, COPY_VISIBLE_AT_MS);
}
