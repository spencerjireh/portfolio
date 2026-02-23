export interface BioData {
  name: string;
  lastName: string;
  title: string;
  blurb: string[];
}

export interface EducationData {
  degree: string;
  institution: string;
  year: string;
}

export interface LinkData {
  github: string;
  linkedin: string;
  resumePath: string;
  email: string;
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

export interface HobbyData {
  name: string;
  description: string;
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
  bio: ContentRow<BioData>[];
  education: ContentRow<EducationData>[];
  link: ContentRow<LinkData>[];
  experience: ContentRow<ExperienceData>[];
  skill: ContentRow<SkillData>[];
  hobby: ContentRow<HobbyData>[];
  project: ContentRow<ProjectData>[];
  contact: ContentRow<ContactData>[];
}
