export interface HeroData {
  name: string;
  lastName: string;
  title: string;
  blurb: string[];
  links: {
    github: string;
    linkedin: string;
    resumePath: string;
    email: string;
  };
}

export interface ExperienceData {
  year: string;
  title: string;
  company: string;
  duration: string;
  website: string;
  description: string;
  tech: string;
  responsibilities: string[];
}

export interface SkillData {
  name: string;
  context: string;
  tier: 'primary' | 'extended' | 'familiar';
}

export interface ProjectData {
  num: string;
  title: string;
  tags: string[];
  techStack: string[];
  techStackMobile: string;
  links: { label: string; url: string }[];
  extraMeta?: { label: string; value: string }[];
  metaNote?: string;
  descriptions: string[];
  highlightsTitle: string;
  highlights: string[];
}

export interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  github: string;
  linkedin: string;
  footer: string;
}

export interface ContentRow<T = unknown> {
  id: string;
  type: string;
  slug: string;
  data: T;
  status: string;
  version: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioBundle {
  hero: ContentRow<HeroData>[];
  experience: ContentRow<ExperienceData>[];
  skill: ContentRow<SkillData>[];
  project: ContentRow<ProjectData>[];
  contact: ContentRow<ContactData>[];
}
