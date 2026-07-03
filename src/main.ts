import './style.css';
import splashImageUrl from './assets/splash-screen.png';
import architectureDiagramUrl from './assets/Diagram Architecture.png';
import urbanRecyclingImageUrl from './assets/UrbanRecycling.png';
import qualityConsultingVideoUrl from './assets/stock-footage-man-and-woman-at-desk-with-laptop-shake-hands-hand-extended-across-table-over-documents-in.webm';
import systemsThinkingVideoUrl from './assets/stock-footage-center-woman-planning-reaching-with-red-marker-writing-on-glass-while-tech-overlaying-charts.webm';
import aiIntegrationsVideoUrl from './assets/stock-footage-brainstorming-concept-icon-idea-on-robot-arm-artificial-intelligence-k-size-movie.webm';
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
const qualityConsultingVideoEl = document.getElementById('quality-consulting-video');
const systemsThinkingVideoEl = document.getElementById('systems-thinking-video');
const aiIntegrationsVideoEl = document.getElementById('ai-integrations-video');
const projectImageEls = [1, 2, 3, 4]
  .map((index) => document.getElementById(`project-image-${index}`))
  .filter((element): element is HTMLImageElement => element instanceof HTMLImageElement);

if (splashBgImageEl instanceof HTMLImageElement) {
  splashBgImageEl.src = splashImageUrl;
}

if (architectureImageEl instanceof HTMLImageElement) {
  architectureImageEl.src = architectureDiagramUrl;
}

if (qualityConsultingVideoEl instanceof HTMLVideoElement) {
  qualityConsultingVideoEl.src = qualityConsultingVideoUrl;
}

if (systemsThinkingVideoEl instanceof HTMLVideoElement) {
  systemsThinkingVideoEl.src = systemsThinkingVideoUrl;
}

if (aiIntegrationsVideoEl instanceof HTMLVideoElement) {
  aiIntegrationsVideoEl.src = aiIntegrationsVideoUrl;
}

projectImageEls.forEach((projectImageEl) => {
  projectImageEl.src = urbanRecyclingImageUrl;
});

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

type ParallaxTypewriterOptions = {
  titleId: string;
  contentId: string;
  onReveal?: () => void;
};

function setupParallaxTypewriterReveal({
  titleId,
  contentId,
  onReveal,
}: ParallaxTypewriterOptions): void {
  const titleEl = document.getElementById(titleId);
  const contentEl = document.getElementById(contentId);

  if (!(titleEl instanceof HTMLElement) || !(contentEl instanceof HTMLElement)) {
    return;
  }

  const titleTextEl = titleEl.querySelector<HTMLElement>('.typewriter-line__text');
  const titleText = titleEl.dataset.text ?? '';
  let hasStarted = false;

  const startTitleTypewriter = () => {
    if (!titleTextEl || hasStarted) return;
    hasStarted = true;

    typeInto(titleTextEl, titleText, {
      charDelay: 58,
      jitter: 20,
      onDone: () => {
        titleEl.classList.add('is-done');
        contentEl.classList.add('is-visible');
        onReveal?.();
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

    observer.observe(titleEl);
  } else {
    startTitleTypewriter();
  }
}

setupParallaxTypewriterReveal({
  titleId: 'architecture-title',
  contentId: 'architecture-content',
});

setupParallaxTypewriterReveal({
  titleId: 'quality-consulting-title',
  contentId: 'quality-consulting-content',
  onReveal: () => {
    if (!(qualityConsultingVideoEl instanceof HTMLVideoElement)) return;

    qualityConsultingVideoEl.currentTime = 0;
    void qualityConsultingVideoEl.play().catch(() => {
      // Ignore autoplay rejections in restrictive environments.
    });
  },
});

setupParallaxTypewriterReveal({
  titleId: 'systems-thinking-title',
  contentId: 'systems-thinking-content',
  onReveal: () => {
    if (!(systemsThinkingVideoEl instanceof HTMLVideoElement)) return;

    systemsThinkingVideoEl.currentTime = 0;
    void systemsThinkingVideoEl.play().catch(() => {
      // Ignore autoplay rejections in restrictive environments.
    });
  },
});

setupParallaxTypewriterReveal({
  titleId: 'ai-integrations-title',
  contentId: 'ai-integrations-content',
  onReveal: () => {
    if (!(aiIntegrationsVideoEl instanceof HTMLVideoElement)) return;

    aiIntegrationsVideoEl.currentTime = 0;
    void aiIntegrationsVideoEl.play().catch(() => {
      // Ignore autoplay rejections in restrictive environments.
    });
  },
});

setupParallaxTypewriterReveal({
  titleId: 'personal-projects-title',
  contentId: 'personal-projects-content',
});