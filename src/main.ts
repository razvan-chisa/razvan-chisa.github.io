import './style.css';
import splashImageUrl from './assets/splash-screen.png';
import architectureDiagramUrl from './assets/Diagram Architecture.png';
import urbanRecyclingImageUrl from './assets/UrbanRecycling.png';
import qualityConsultingVideoUrl from './assets/stock-footage-man-and-woman-at-desk-with-laptop-shake-hands-hand-extended-across-table-over-documents-in.webm';
import systemsThinkingVideoUrl from './assets/stock-footage-center-woman-planning-reaching-with-red-marker-writing-on-glass-while-tech-overlaying-charts.webm';
import aiIntegrationsVideoUrl from './assets/stock-footage-brainstorming-concept-icon-idea-on-robot-arm-artificial-intelligence-k-size-movie.webm';
import { runTypewriters, typeInto } from './typewriter';
import { mountSharedSections } from './shared-sections';

mountSharedSections();

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
const collaborationYesButtonEl = document.getElementById('collaboration-yes');
const collaborationNoButtonEl = document.getElementById('collaboration-no');
const contactFormCardEl = document.getElementById('contact-form-card');
const feedbackFormCardEl = document.getElementById('feedback-form-card');
const genderSelectEl = document.getElementById('gender-select');
const genderCustomFieldEl = document.getElementById('gender-custom-field');

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

function setupCollaborationForms(): void {
  if (
    !(collaborationYesButtonEl instanceof HTMLButtonElement) ||
    !(collaborationNoButtonEl instanceof HTMLButtonElement) ||
    !(contactFormCardEl instanceof HTMLElement) ||
    !(feedbackFormCardEl instanceof HTMLElement)
  ) {
    return;
  }

  const setMode = (mode: 'contact' | 'feedback'): void => {
    const isContact = mode === 'contact';

    contactFormCardEl.hidden = !isContact;
    feedbackFormCardEl.hidden = isContact;

    collaborationYesButtonEl.classList.toggle('is-active', isContact);
    collaborationNoButtonEl.classList.toggle('is-active', !isContact);

    collaborationYesButtonEl.setAttribute('aria-pressed', String(isContact));
    collaborationNoButtonEl.setAttribute('aria-pressed', String(!isContact));
  };

  collaborationYesButtonEl.addEventListener('click', () => {
    setMode('contact');
  });

  collaborationNoButtonEl.addEventListener('click', () => {
    setMode('feedback');
  });

  if (genderSelectEl instanceof HTMLSelectElement && genderCustomFieldEl instanceof HTMLElement) {
    const updateGenderField = () => {
      const needsCustomValue = genderSelectEl.value === 'non-binary';
      genderCustomFieldEl.hidden = !needsCustomValue;
    };

    genderSelectEl.addEventListener('change', updateGenderField);
    updateGenderField();
  }
}

function setupHashtagEditors(): void {
  const editors = document.querySelectorAll<HTMLElement>('[data-hashtags-editor]');

  editors.forEach((editorEl) => {
    const listEl = editorEl.querySelector<HTMLElement>('[data-hashtags-list]');
    const inputEl = editorEl.querySelector<HTMLInputElement>('[data-hashtags-input]');
    const hiddenValueEl = editorEl.querySelector<HTMLInputElement>('[data-hashtags-value]');
    const sourceSelectId = editorEl.dataset.sourceSelectId ?? '';
    const defaultPrefix = editorEl.dataset.defaultPrefix ?? 'domain';
    const sourceSelectEl = sourceSelectId ? document.getElementById(sourceSelectId) : null;

    if (!(listEl instanceof HTMLElement) || !(inputEl instanceof HTMLInputElement) || !(hiddenValueEl instanceof HTMLInputElement)) {
      return;
    }

    const tags: string[] = [];
    let autoTag: string | null = null;

    const normalizeTag = (rawTag: string): string => {
      return rawTag
        .trim()
        .toLowerCase()
        .replace(/^#+/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '');
    };

    const renderTags = (): void => {
      listEl.replaceChildren();

      tags.forEach((tag) => {
        const pillEl = document.createElement('button');
        pillEl.type = 'button';
        pillEl.className = 'tags-editor__tag';
        pillEl.setAttribute('aria-label', `Remove hashtag ${tag}`);
        pillEl.textContent = `#${tag}`;

        const removeEl = document.createElement('span');
        removeEl.className = 'tags-editor__remove';
        removeEl.setAttribute('aria-hidden', 'true');
        removeEl.textContent = '×';
        pillEl.appendChild(removeEl);

        pillEl.addEventListener('click', () => {
          const tagIndex = tags.indexOf(tag);
          if (tagIndex < 0) return;
          tags.splice(tagIndex, 1);
          if (autoTag === tag) autoTag = null;
          renderTags();
        });

        listEl.appendChild(pillEl);
      });

      hiddenValueEl.value = tags.join(',');
    };

    const addTag = (rawTag: string): void => {
      const tag = normalizeTag(rawTag);
      if (!tag || tags.includes(tag)) return;
      tags.push(tag);
      renderTags();
    };

    const setDefaultTagFromSelect = (): void => {
      if (!(sourceSelectEl instanceof HTMLSelectElement)) return;

      if (autoTag) {
        const autoTagIndex = tags.indexOf(autoTag);
        if (autoTagIndex >= 0) tags.splice(autoTagIndex, 1);
        autoTag = null;
      }

      const domainValue = normalizeTag(sourceSelectEl.value);
      if (!domainValue) {
        renderTags();
        return;
      }

      autoTag = `${defaultPrefix}-${domainValue}`;
      if (!tags.includes(autoTag)) tags.unshift(autoTag);
      renderTags();
    };

    inputEl.addEventListener('keydown', (event) => {
      const pressedEnter = event.key === 'Enter';
      const pressedComma = event.key === ',';
      if (!pressedEnter && !pressedComma) return;

      event.preventDefault();
      addTag(inputEl.value);
      inputEl.value = '';
    });

    inputEl.addEventListener('blur', () => {
      if (!inputEl.value.trim()) return;
      addTag(inputEl.value);
      inputEl.value = '';
    });

    if (sourceSelectEl instanceof HTMLSelectElement) {
      sourceSelectEl.addEventListener('change', setDefaultTagFromSelect);
      setDefaultTagFromSelect();
    } else {
      renderTags();
    }
  });
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

setupParallaxTypewriterReveal({
  titleId: 'collaboration-title',
  contentId: 'collaboration-content',
});

setupCollaborationForms();
setupHashtagEditors();