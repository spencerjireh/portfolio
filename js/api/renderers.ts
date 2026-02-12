import type {
  PortfolioBundle,
  HeroData,
  ExperienceData,
  SkillData,
  ProjectData,
  ContactData,
  ContentRow,
} from './types';
import { initProjectAccordion } from '../ui/project-accordion';
import { initProjectNavigation } from '../ui/project-navigation';

const LINK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`;

const _escEl = document.createElement('span');
function esc(s: string): string {
  _escEl.textContent = s;
  return _escEl.innerHTML;
}

/** Escape then restore only safe inline tags: <strong>, <em>, <a href="https://...">.  */
function safeInline(s: string): string {
  let out = esc(s);
  out = out.replace(/&lt;(\/?)strong&gt;/g, '<$1strong>');
  out = out.replace(/&lt;(\/?)em&gt;/g, '<$1em>');
  out = out.replace(
    /&lt;a href=&quot;(https?:\/\/[^&]*(?:&amp;[^&]*)*)&quot;&gt;(.+?)&lt;\/a&gt;/g,
    (_, url, text) => `<a href="${url.replace(/&amp;/g, '&')}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  );
  return out;
}

function escUrl(url: string): string {
  try {
    const u = new URL(url, location.origin);
    if (u.protocol === 'https:' || u.protocol === 'http:' || u.protocol === 'mailto:') return url;
  } catch { /* invalid URL */ }
  return '#';
}

// ── Hero ──

function renderHero(data: HeroData): void {
  const name = document.querySelector('.hero-name');
  const title = document.querySelector('.hero-title');
  const blurb = document.querySelector('.hero-blurb');
  const links = document.querySelector('.hero-links');
  if (!name || !title || !blurb || !links) return;

  name.innerHTML = `${esc(data.name)} <span class="hero-name-last">${esc(data.lastName)}</span>`;
  title.textContent = data.title;
  blurb.innerHTML = data.blurb.map(p => `<p>${safeInline(p)}</p>`).join('');
  links.innerHTML = [
    `<a href="${escUrl(data.links.github)}" target="_blank" rel="noopener noreferrer">github</a>`,
    `<span class="hero-links-separator">/</span>`,
    `<a href="${escUrl(data.links.linkedin)}" target="_blank" rel="noopener noreferrer">linkedin</a>`,
    `<span class="hero-links-separator">/</span>`,
    `<a href="${escUrl(data.links.resumePath)}" target="_blank" rel="noopener noreferrer">resume</a>`,
    `<span class="hero-links-separator">/</span>`,
    `<button type="button" class="hero-email-btn" data-copy-email="${esc(data.links.email)}">${esc(data.links.email)}</button>`,
  ].join('\n');
}

// ── Experience ──

function renderExperiences(items: ContentRow<ExperienceData>[]): void {
  const list = document.querySelector('.experience-list');
  if (!list) return;

  list.innerHTML = items
    .map(({ data }) => {
      const responsibilitiesHtml = data.responsibilities
        .map(r => `<li>${esc(r)}</li>`)
        .join('');

      return `<div class="experience-item reveal" data-experience>
  <span class="experience-year">${esc(data.year)}</span>
  <h3 class="experience-title">${esc(data.title)}</h3>
  <p class="experience-company">${esc(data.company)}</p>
  <div class="experience-detail-content" hidden>
    <span data-title>${esc(data.title)}</span>
    <span data-company>${esc(data.company)}</span>
    <span data-duration>${esc(data.duration)}</span>
    <span data-website>${esc(data.website)}</span>
    <span data-description>${esc(data.description)}</span>
    <span data-tech>${esc(data.tech)}</span>
    <ul data-responsibilities>${responsibilitiesHtml}</ul>
  </div>
</div>`;
    })
    .join('\n');
}

// ── Skills ──

const TIER_CONFIG: Record<
  string,
  { title: string; subtitle: string; markerClass: string }
> = {
  primary: {
    title: 'Primary Stack',
    subtitle: 'Daily drivers in production',
    markerClass: 'skill-tier-marker--primary',
  },
  extended: {
    title: 'Extended Toolkit',
    subtitle: 'Confident proficiency',
    markerClass: 'skill-tier-marker--extended',
  },
  familiar: {
    title: 'Familiar With',
    subtitle: 'Project experience',
    markerClass: 'skill-tier-marker--familiar',
  },
};

function renderSkills(items: ContentRow<SkillData>[]): void {
  const container = document.querySelector('.skills-tiered');
  if (!container) return;

  const grouped: Record<string, ContentRow<SkillData>[]> = {};
  for (const item of items) {
    const tier = item.data.tier;
    (grouped[tier] ??= []).push(item);
  }

  const tierOrder: string[] = ['primary', 'extended', 'familiar'];
  container.innerHTML = tierOrder
    .filter(tier => grouped[tier]?.length)
    .map(tier => {
      const cfg = TIER_CONFIG[tier];
      const skillButtons = grouped[tier]
        .map(
          ({ data }) =>
            `<button class="skill-item" data-skill>
  <span class="skill-name">${esc(data.name)}</span>
  <span class="skill-context" hidden>${esc(data.context)}</span>
</button>`,
        )
        .join('\n');

      return `<div class="skill-tier reveal">
  <h3 class="skill-tier-title">
    <span class="skill-tier-marker ${cfg.markerClass}"></span>
    ${cfg.title}
  </h3>
  <p class="skill-tier-subtitle">${cfg.subtitle}</p>
  <div class="skill-items">
    ${skillButtons}
  </div>
</div>`;
    })
    .join('\n');
}

// ── Projects ──

function renderProjects(items: ContentRow<ProjectData>[]): void {
  if (items.length === 0) return;

  // ── Build project section HTML ──
  const sectionsHtml = items.map(({ data }, i) => {
    const idx = i + 1;

    // Desktop sidebar meta
    let metaHtml = `<div class="project-meta-section">
          <h4 class="project-meta-label">Tech Stack</h4>
          <ul class="project-tech-list">
            ${data.techStack.map(t => `<li>${esc(t)}</li>`).join('\n            ')}
          </ul>
        </div>`;

    if (data.extraMeta?.length) {
      for (const meta of data.extraMeta) {
        metaHtml += `\n        <div class="project-meta-section">
          <h4 class="project-meta-label">${esc(meta.label)}</h4>
          <p class="project-meta-value">${esc(meta.value)}</p>
        </div>`;
      }
    }

    metaHtml += `\n        <div class="project-meta-links">
          ${data.links.map(l => `<a href="${escUrl(l.url)}" target="_blank" rel="noopener noreferrer" class="project-link">${esc(l.label)} ${LINK_ICON}</a>`).join('\n          ')}
        </div>`;

    if (data.metaNote) {
      metaHtml += `\n        <p class="project-meta-note">${esc(data.metaNote)}</p>`;
    }

    // Mobile meta
    let mobileMetaHtml = `<div class="project-meta-mobile-section">
          <h4 class="project-meta-label">Tech Stack</h4>
          <p class="project-meta-value">${esc(data.techStackMobile)}</p>
        </div>
        <div class="project-meta-mobile-links">
          ${data.links.map(l => `<a href="${escUrl(l.url)}" target="_blank" rel="noopener noreferrer" class="project-link">${esc(l.label)}</a>`).join('\n          ')}
        </div>`;

    if (data.metaNote) {
      mobileMetaHtml += `\n        <p class="project-meta-note">${esc(data.metaNote)}</p>`;
    }

    // Article content
    const descriptionsHtml = data.descriptions
      .map(d => `<p class="project-description">${esc(d)}</p>`)
      .join('\n        ');

    const highlightsHtml = data.highlights
      .map(h => `<li>${esc(h)}</li>`)
      .join('\n            ');

    return `<section id="project-${idx}" class="section-framed section-right section-project" data-project-section="${idx}">
    <div class="section-card">
    <aside class="project-meta">
      <div class="project-meta-content">
        ${metaHtml}
      </div>
    </aside>
    <article class="project-article" data-project-article>
      <header class="project-article-header">
        <span class="project-num">${esc(data.num)}</span>
        <h2 class="project-title">${esc(data.title)}</h2>
        <div class="project-tags">
          ${data.tags.map(t => `<span class="project-tag">${esc(t)}</span>`).join('\n          ')}
        </div>
      </header>
      <div class="project-meta-mobile">
        ${mobileMetaHtml}
      </div>
      <div class="project-article-content">
        ${descriptionsHtml}
        <div class="project-highlights">
          <h4 class="project-highlights-title">${esc(data.highlightsTitle)}</h4>
          <ul class="project-highlights-list">
            ${highlightsHtml}
          </ul>
        </div>
      </div>
    </article>
    </div>
  </section>`;
  }).join('\n\n  ');

  // ── Insert project sections before #contact ──
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.insertAdjacentHTML('beforebegin', sectionsHtml);
  }

  // ── Generate index nav items ──
  const indexNav = document.querySelector('.projects-index-nav');
  if (indexNav) {
    indexNav.innerHTML = items.map(({ data }, i) => {
      const idx = i + 1;
      return `<a href="#project-${idx}" class="project-index-item" data-project-link="${idx}">
            <span class="project-index-num">${esc(data.num)}</span>
            <span class="project-index-title">${esc(data.title)}</span>
          </a>`;
    }).join('\n          ');
  }

  // ── Generate side nav items ──
  const sideNav = document.querySelector('[data-project-nav]');
  if (sideNav) {
    sideNav.innerHTML = items.map(({ data }, i) => {
      const idx = i + 1;
      return `<a href="#project-${idx}" class="project-side-nav-item" data-nav-target="${idx}">
      <span class="project-side-nav-num">${esc(data.num)}</span>
      <span class="project-side-nav-line"></span>
    </a>`;
    }).join('\n    ');
  }

  // ── Generate dot nav items ──
  const dotsNav = document.querySelector('[data-project-dots]');
  if (dotsNav) {
    dotsNav.innerHTML = items.map((_, i) => {
      const idx = i + 1;
      return `<button class="project-dot" data-dot-target="${idx}" aria-label="Go to project ${idx}"></button>`;
    }).join('\n    ');
  }

  // ── Init UI that depends on dynamic project DOM ──
  initProjectNavigation();
  initProjectAccordion();
}

// ── Contact ──

function renderContact(data: ContactData): void {
  const title = document.querySelector('.contact-band-title');
  const subtitle = document.querySelector('.contact-band-subtitle');
  const emailLink = document.querySelector('.contact-band-link');
  const social = document.querySelector('.contact-band-social');
  const footer = document.querySelector('.contact-footer');

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (emailLink) {
    emailLink.setAttribute('href', escUrl(`mailto:${data.email}`));
    emailLink.textContent = data.email;
  }
  if (social) {
    social.innerHTML = [
      `<a href="${escUrl(data.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
      `<span class="contact-separator">/</span>`,
      `<a href="${escUrl(data.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`,
    ].join('\n');
  }
  if (footer) footer.textContent = data.footer;
}

// ── Public API ──

export function renderAllContent(bundle: PortfolioBundle): void {
  if (bundle.hero.length) renderHero(bundle.hero[0].data);
  if (bundle.experience.length) renderExperiences(bundle.experience);
  if (bundle.skill.length) renderSkills(bundle.skill);
  if (bundle.project.length) renderProjects(bundle.project);
  if (bundle.contact.length) renderContact(bundle.contact[0].data);
}
