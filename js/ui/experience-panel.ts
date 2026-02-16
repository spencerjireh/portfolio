export function initExperiencePanel(): () => void {
  const panel = document.querySelector<HTMLElement>('[data-experience-panel]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-panel-close]');
  const list = document.querySelector<HTMLElement>('.experience-list');

  if (!panel || !list) return () => {};

  const panelTitle = panel.querySelector<HTMLElement>('[data-panel-title]');
  const panelCompany = panel.querySelector<HTMLElement>('[data-panel-company]');
  const panelDuration = panel.querySelector<HTMLElement>('[data-panel-duration]');
  const panelDescription = panel.querySelector<HTMLElement>('[data-panel-description]');
  const panelResponsibilities = panel.querySelector<HTMLUListElement>('[data-panel-responsibilities]');
  const panelTech = panel.querySelector<HTMLElement>('[data-panel-tech]');
  const panelLink = panel.querySelector<HTMLAnchorElement>('[data-panel-link]');

  let pinnedItem: HTMLElement | null = null;
  let hoveredItem: HTMLElement | null = null;
  let isDesktop = window.innerWidth >= 1024;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  const PANEL_LINGER_DURATION = 1000;

  const clearHideTimeout = (): void => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  };

  const updatePanelContent = (item: HTMLElement): void => {
    const detailContent = item.querySelector('.experience-detail-content');
    if (!detailContent) return;

    const title = detailContent.querySelector('[data-title]')?.textContent || '';
    const company = detailContent.querySelector('[data-company]')?.textContent || '';
    const duration = detailContent.querySelector('[data-duration]')?.textContent || '';
    const description = detailContent.querySelector('[data-description]')?.textContent || '';
    const website = detailContent.querySelector('[data-website]')?.textContent || '';
    const tech = detailContent.querySelector('[data-tech]')?.textContent || '';
    const responsibilities = detailContent.querySelector('[data-responsibilities]');

    if (panelTitle) panelTitle.textContent = title;
    if (panelCompany) panelCompany.textContent = company;
    if (panelDuration) panelDuration.textContent = duration;
    if (panelDescription) panelDescription.textContent = description;
    if (panelTech) panelTech.textContent = tech;

    if (panelLink) {
      panelLink.href = website;
      panelLink.style.display = website ? 'inline-flex' : 'none';
    }

    if (panelResponsibilities && responsibilities) {
      panelResponsibilities.innerHTML = responsibilities.innerHTML;
    }
  };

  const showPanel = (item: HTMLElement): void => {
    clearHideTimeout();
    updatePanelContent(item);
    panel.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
  };

  const scheduleHidePanel = (): void => {
    if (pinnedItem || hoveredItem) return;

    clearHideTimeout();
    hideTimeout = setTimeout(() => {
      if (!pinnedItem && !hoveredItem) {
        panel.classList.remove('is-visible');
        panel.setAttribute('aria-hidden', 'true');
      }
    }, PANEL_LINGER_DURATION);
  };

  const pinPanel = (item: HTMLElement): void => {
    clearHideTimeout();

    if (pinnedItem && pinnedItem !== item) {
      pinnedItem.classList.remove('is-active');
    }

    if (pinnedItem === item) {
      pinnedItem.classList.remove('is-active');
      pinnedItem = null;
      panel.classList.remove('is-pinned');
      scheduleHidePanel();
    } else {
      pinnedItem = item;
      item.classList.add('is-active');
      panel.classList.add('is-pinned');
      updatePanelContent(item);
    }
  };

  const closePanel = (): void => {
    clearHideTimeout();
    if (pinnedItem) {
      pinnedItem.classList.remove('is-active');
      pinnedItem = null;
    }
    panel.classList.remove('is-visible', 'is-pinned');
    panel.setAttribute('aria-hidden', 'true');
  };

  const generateAccordion = (item: HTMLElement): HTMLElement | null => {
    const detailContent = item.querySelector('.experience-detail-content');
    if (!detailContent) return null;

    const description = detailContent.querySelector('[data-description]')?.textContent || '';
    const website = detailContent.querySelector('[data-website]')?.textContent || '';
    const tech = detailContent.querySelector('[data-tech]')?.textContent || '';
    const responsibilities = detailContent.querySelector('[data-responsibilities]');

    const accordion = document.createElement('div');
    accordion.className = 'experience-accordion';

    accordion.innerHTML = `
      ${description ? `
      <div class="experience-accordion-section">
        <p class="experience-accordion-description">${description}</p>
      </div>` : ''}
      <div class="experience-accordion-section">
        <h4 class="experience-accordion-title">Responsibilities</h4>
        <ul class="experience-accordion-list">${responsibilities?.innerHTML || ''}</ul>
      </div>
      <div class="experience-accordion-section">
        <h4 class="experience-accordion-title">Tech Stack</h4>
        <p class="experience-accordion-content">${tech}</p>
      </div>
      ${website ? `
      <div class="experience-accordion-section">
        <a href="${website}" target="_blank" rel="noopener noreferrer" class="experience-accordion-link">
          Visit Company
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      </div>` : ''}
    `;

    return accordion;
  };

  const toggleAccordion = (item: HTMLElement): void => {
    const isExpanded = item.classList.contains('is-expanded');

    list.querySelectorAll<HTMLElement>('[data-experience]').forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('is-expanded')) {
        otherItem.classList.remove('is-expanded');
        const accordion = otherItem.querySelector('.experience-accordion');
        if (accordion) accordion.remove();
      }
    });

    if (isExpanded) {
      item.classList.remove('is-expanded');
      const accordion = item.querySelector('.experience-accordion');
      if (accordion) accordion.remove();
    } else {
      item.classList.add('is-expanded');
      if (!item.querySelector('.experience-accordion')) {
        const accordion = generateAccordion(item);
        if (accordion) item.appendChild(accordion);
      }
    }
  };

  // -- Delegated events on stable .experience-list container --

  // mouseover bubbles (unlike mouseenter), so we track which item is hovered
  // and only fire enter/leave logic when the hovered item actually changes.
  const onMouseover = (e: MouseEvent): void => {
    if (!isDesktop) return;
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-experience]');
    if (item === hoveredItem) return;

    hoveredItem = item;
    if (item) {
      clearHideTimeout();
      if (!pinnedItem) showPanel(item);
    }
  };

  // mouseleave on the container fires once when the cursor exits entirely.
  const onMouseleave = (): void => {
    if (!isDesktop) return;
    hoveredItem = null;
    scheduleHidePanel();
  };

  const onClick = (e: MouseEvent): void => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-experience]');
    if (!item) return;

    if (isDesktop) {
      pinPanel(item);
    } else {
      toggleAccordion(item);
    }
  };

  list.addEventListener('mouseover', onMouseover);
  list.addEventListener('mouseleave', onMouseleave);
  list.addEventListener('click', onClick);

  // Panel hover keeps it open (panel itself is outside .experience-list)
  const onPanelEnter = (): void => {
    if (isDesktop) clearHideTimeout();
  };
  const onPanelLeave = (): void => {
    if (isDesktop && !pinnedItem) scheduleHidePanel();
  };
  panel.addEventListener('mouseenter', onPanelEnter);
  panel.addEventListener('mouseleave', onPanelLeave);

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanel();
  });

  const handleResize = (): void => {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth >= 1024;

    if (wasDesktop !== isDesktop) {
      clearHideTimeout();
      hoveredItem = null;
      closePanel();
      list.querySelectorAll<HTMLElement>('[data-experience]').forEach(item => {
        item.classList.remove('is-expanded', 'is-active');
        const accordion = item.querySelector('.experience-accordion');
        if (accordion) accordion.remove();
      });
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    list.removeEventListener('mouseover', onMouseover);
    list.removeEventListener('mouseleave', onMouseleave);
    list.removeEventListener('click', onClick);
    panel.removeEventListener('mouseenter', onPanelEnter);
    panel.removeEventListener('mouseleave', onPanelLeave);
    window.removeEventListener('resize', handleResize);
  };
}
