type SharedSectionName = 'projects' | 'contact' | 'under-construction';

const sharedSectionMarkup: Record<SharedSectionName, string> = {
  projects: `
    <section id="personal-projects" class="parallax-section" aria-labelledby="personal-projects-title">
      <div class="parallax-section__inner">
        <h2 class="parallax-section__title typewriter-line" id="personal-projects-title" data-text="Personal Projects">
          <span class="typewriter-line__text"></span><span class="typewriter-line__cursor">&nbsp;</span>
        </h2>

        <div class="parallax-section__content" id="personal-projects-content">
          <div class="projects-grid" aria-label="Personal project cards">
            <a class="project-card" href="/dummy/" aria-label="Open Urban Recycling project details">
              <img class="project-card__image" id="project-image-1" alt="Urban Recycling project screenshot" />
              <span class="project-card__label">Urban Recycling</span>
            </a>

            <a class="project-card" href="/dummy/" aria-label="Open Urban Recycling project details">
              <img class="project-card__image" id="project-image-2" alt="Urban Recycling project screenshot" />
              <span class="project-card__label">Urban Recycling</span>
            </a>

            <a class="project-card" href="/dummy/" aria-label="Open Urban Recycling project details">
              <img class="project-card__image" id="project-image-3" alt="Urban Recycling project screenshot" />
              <span class="project-card__label">Urban Recycling</span>
            </a>

            <a class="project-card" href="/dummy/" aria-label="Open Urban Recycling project details">
              <img class="project-card__image" id="project-image-4" alt="Urban Recycling project screenshot" />
              <span class="project-card__label">Urban Recycling</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  contact: `
    <section id="contact" class="parallax-section" aria-labelledby="collaboration-title">
      <div class="parallax-section__inner">
        <h2 class="parallax-section__title typewriter-line" id="collaboration-title" data-text="Let's collaborate">
          <span class="typewriter-line__text"></span><span class="typewriter-line__cursor">&nbsp;</span>
        </h2>

        <div class="parallax-section__content" id="collaboration-content">
          <div class="collaboration">
            <p class="collaboration__question">Would you like to start a collaboration with me?</p>

            <div class="collaboration__choices" role="group" aria-label="Collaboration preference">
              <button type="button" class="choice-button" id="collaboration-yes" aria-controls="contact-form-card">Yes</button>
              <button type="button" class="choice-button" id="collaboration-no" aria-controls="feedback-form-card">No</button>
            </div>

            <article class="form-card" id="contact-form-card" hidden>
              <h3 class="form-card__title">Contact Form</h3>
              <form class="smart-form" action="/dummy/" method="get">
                <label class="smart-form__field">
                  <span>Fullname</span>
                  <input type="text" name="fullname" autocomplete="name" required />
                </label>

                <label class="smart-form__field">
                  <span>Email</span>
                  <input type="email" name="email" autocomplete="email" required />
                </label>

                <label class="smart-form__field">
                  <span>Business Domain</span>
                  <select name="business_domain" id="contact-domain-select" required>
                    <option value="" selected disabled>Select domain</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail & Ecommerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="logistics">Logistics</option>
                    <option value="public">Public Sector</option>
                    <option value="education">Education</option>
                    <option value="other">Specify Other</option>
                  </select>
                </label>

                <label class="smart-form__field smart-form__field--hidden" id="contact-domain-other-field">
                  <span>Specify domain</span>
                  <input
                    type="text"
                    name="business_domain_other"
                    id="contact-domain-other"
                    placeholder="Specify domain"
                    autocomplete="organization"
                  />
                </label>

                <label class="smart-form__field smart-form__field--full">
                  <span>Message</span>
                  <textarea name="message" rows="5" required></textarea>
                </label>

                <button class="smart-form__submit smart-form__field--full" type="submit">Submit</button>
              </form>
            </article>

            <article class="form-card" id="feedback-form-card" hidden>
              <h3 class="form-card__title">Feedback Form</h3>
              <form class="smart-form" action="/dummy/" method="get">
                <label class="smart-form__field">
                  <span>Email (optional)</span>
                  <input type="email" name="feedback_email" autocomplete="email" />
                </label>

                <label class="smart-form__field">
                  <span>Feedback category</span>
                  <select name="feedback_category" required>
                    <option value="" selected disabled>Select category</option>
                    <option value="website">Website</option>
                    <option value="projects">Projects</option>
                    <option value="content">Content clarity</option>
                    <option value="collaboration">Collaboration process</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label class="smart-form__field smart-form__field--full">
                  <span>Message</span>
                  <textarea name="feedback_message" rows="5" required></textarea>
                </label>

                <button class="smart-form__submit smart-form__field--full" type="submit">Submit</button>
              </form>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  'under-construction': `
    <section id="under-construction" class="parallax-section" aria-labelledby="under-construction-title">
      <div class="parallax-section__inner">
        <h2 class="parallax-section__title" id="under-construction-title">Under Construction</h2>
        <div class="parallax-section__content">
          <p>This page is currently under construction. Please check back later.</p>
        </div>
      </div>
    </section>
  `,
};

export function mountSharedSections(): void {
  const hosts = document.querySelectorAll<HTMLElement>('[data-shared-section]');

  hosts.forEach((hostEl) => {
    const sectionName = hostEl.dataset.sharedSection as SharedSectionName | undefined;
    if (!sectionName) return;

    const markup = sharedSectionMarkup[sectionName];
    if (!markup) return;

    const template = document.createElement('template');
    template.innerHTML = markup.trim();
    const sectionEl = template.content.firstElementChild;
    if (!sectionEl) return;

    hostEl.replaceWith(sectionEl);
  });
}
