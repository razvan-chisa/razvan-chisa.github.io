type TypeIntoOptions = {
  charDelay?: number;
  jitter?: number;
  onDone?: () => void;
};

/**
 * Minimal typewriter effect. Reveals `text` inside `el` one character at a
 * time. Speed varies slightly per character so multiple lines running
 * concurrently don't look mechanically synchronized.
 */
export function typeInto(
  el: HTMLElement,
  text: string,
  { charDelay = 32, jitter = 18, onDone }: TypeIntoOptions = {},
): void {
  let i = 0;

  const tick = () => {
    i += 1;
    el.textContent = text.slice(0, i);

    if (i < text.length) {
      const delay = charDelay + Math.random() * jitter;
      window.setTimeout(tick, delay);
    } else {
      onDone?.();
    }
  };

  tick();
}

type RunTypewritersOptions = {
  staggerMs?: number;
  charDelay?: number;
};

/**
 * Types out every `[data-text]` element found inside `container`, in the DOM
 * order they appear, starting each one `staggerMs` after the previous.
 */
export function runTypewriters(
  container: HTMLElement,
  { staggerMs = 550, charDelay = 32 }: RunTypewritersOptions = {},
): void {
  const lines = Array.from(container.querySelectorAll<HTMLElement>('[data-text]'));

  lines.forEach((line, index) => {
    const textEl = line.querySelector<HTMLElement>('.typewriter-line__text');
    const text = line.dataset.text ?? '';
    if (!textEl) return;

    window.setTimeout(() => {
      typeInto(textEl, text, {
        charDelay,
        onDone: () => line.classList.add('is-done'),
      });
    }, index * staggerMs);
  });
}
