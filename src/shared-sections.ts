type SharedSectionName = 'resume' | 'projects' | 'contact' | 'under-construction';

const sectionFileMap: Record<SharedSectionName, string> = {
  resume: '/src/shared-sections/resume.html',
  projects: '/src/shared-sections/projects.html',
  contact: '/src/shared-sections/contact.html',
  'under-construction': '/src/shared-sections/under-construction.html',
};

async function fetchSection(sectionName: SharedSectionName): Promise<string | null> {
  const filePath = sectionFileMap[sectionName];
  if (!filePath) return null;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      console.warn(`Failed to load shared section: ${sectionName}`, response.status);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.warn(`Failed to load shared section: ${sectionName}`, error);
    return null;
  }
}

export async function mountSharedSections(): Promise<void> {
  const hosts = document.querySelectorAll<HTMLElement>('[data-shared-section]');

  await Promise.all(
    Array.from(hosts).map(async (hostEl) => {
      const sectionName = hostEl.dataset.sharedSection as SharedSectionName | undefined;
      if (!sectionName) return;

      const markup = await fetchSection(sectionName);
      if (!markup) return;

      const template = document.createElement('template');
      template.innerHTML = markup.trim();
      const sectionEl = template.content.firstElementChild;
      if (!sectionEl) return;

      hostEl.replaceWith(sectionEl);
    })
  );
}