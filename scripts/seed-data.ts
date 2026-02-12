export interface SeedItem {
  type: string;
  slug: string;
  data: Record<string, unknown>;
  status: string;
  sortOrder: number;
}

export const seedItems: SeedItem[] = [
  // ── Hero ──
  {
    type: 'hero',
    slug: 'main',
    data: {
      name: 'Spencer Jireh',
      lastName: 'Cebrian',
      title: 'Software Engineer',
      blurb: [
        'Backend-leaning software engineer building at the intersection of <strong>full-stack development</strong> and <strong>applied AI</strong>.',
        'I build products end-to-end -- from backend architecture and infrastructure to frontend -- and integrate AI/ML where it makes the work better. Interested in agentic AI, distributed systems, and self-hosting.',
        '<strong>BS Computer Science</strong>, <em>Mapua University</em> (2025).',
      ],
      links: {
        github: 'https://github.com/spencerjireh',
        linkedin: 'https://www.linkedin.com/in/spencerjireh',
        resumePath: '/Spencer_Jireh_Cebrian_CV.pdf',
        email: 'spencercebrian123@gmail.com',
      },
    },
    status: 'published',
    sortOrder: 0,
  },

  // ── Experience ──
  {
    type: 'experience',
    slug: 'junior-software-engineer',
    data: {
      year: '2024 - Present',
      title: 'Junior Software Engineer',
      company: 'Stratpoint Technologies, Inc.',
      duration: 'July 2024 - Present',
      website: 'https://www.stratpoint.com',
      description:
        'Full-stack Engineer @ AI Labs, working on innovative AI-powered solutions and scalable applications.',
      tech: 'Python, TypeScript, React, Next.js, FastAPI, AWS, PostgreSQL, Docker, LangChain',
      responsibilities: [
        'Develop and maintain AI-powered applications as part of the AI Labs team',
        'Build scalable full-stack solutions using modern frameworks and cloud infrastructure',
        'Implement LLM-based features and integrate various AI/ML models into production systems',
        'Collaborate with cross-functional teams to deliver innovative software products',
      ],
    },
    status: 'published',
    sortOrder: 0,
  },
  {
    type: 'experience',
    slug: 'java-intern',
    data: {
      year: 'Feb - Jul 2024',
      title: 'Java Intern',
      company: 'Stratpoint Technologies, Inc.',
      duration: 'February 2024 - July 2024',
      website: 'https://www.stratpoint.com',
      description:
        'Backend Development with Spring Boot & Node.js. DevOps practices using Kubernetes & Docker.',
      tech: 'Java, Spring Boot, Node.js, NestJS, Kubernetes, Docker, PostgreSQL, MongoDB',
      responsibilities: [
        'Developed backend services using Spring Boot and Node.js frameworks',
        'Implemented RESTful APIs and microservices architecture patterns',
        'Gained hands-on experience with Kubernetes orchestration and Docker containerization',
        'Participated in code reviews and agile development practices',
      ],
    },
    status: 'published',
    sortOrder: 1,
  },
  {
    type: 'experience',
    slug: 'committee-chairperson',
    data: {
      year: 'Aug 2022 - Jul 2023',
      title: 'Committee Chairperson',
      company: 'Junior Philippine Computer Society - Mapua University',
      duration: 'August 2022 - July 2023',
      website: 'https://www.mapua.edu.ph',
      description:
        'Project and Control Committee Chairperson. Creative Committee Chairperson.',
      tech: 'Event Management, Leadership, Project Planning, Adobe Creative Suite, Figma',
      responsibilities: [
        'Led the Project and Control Committee, overseeing event logistics and execution',
        'Served as Creative Committee Chairperson, directing visual design and branding',
        'Coordinated with university administration and external sponsors',
        'Managed team of committee members and delegated tasks effectively',
      ],
    },
    status: 'published',
    sortOrder: 2,
  },

  // ── Skills - Primary ──
  {
    type: 'skill',
    slug: 'python',
    data: {
      name: 'Python',
      context:
        '3+ years. FastAPI backends, ML pipelines, LangChain agents. Primary language at AI Labs.',
      tier: 'primary',
    },
    status: 'published',
    sortOrder: 0,
  },
  {
    type: 'skill',
    slug: 'typescript',
    data: {
      name: 'TypeScript',
      context:
        '2+ years. React/Next.js frontends, Node.js services. Strict typing advocate.',
      tier: 'primary',
    },
    status: 'published',
    sortOrder: 1,
  },
  {
    type: 'skill',
    slug: 'react',
    data: {
      name: 'React',
      context:
        'Next.js, React Query, Zustand. Built consultation platform serving 900+ users.',
      tier: 'primary',
    },
    status: 'published',
    sortOrder: 2,
  },
  {
    type: 'skill',
    slug: 'fastapi',
    data: {
      name: 'FastAPI',
      context:
        'Production APIs at Stratpoint. Async patterns, Pydantic validation, OpenAPI.',
      tier: 'primary',
    },
    status: 'published',
    sortOrder: 3,
  },
  {
    type: 'skill',
    slug: 'postgresql',
    data: {
      name: 'PostgreSQL',
      context:
        'Primary database. Complex queries, migrations, used across all major projects.',
      tier: 'primary',
    },
    status: 'published',
    sortOrder: 4,
  },
  {
    type: 'skill',
    slug: 'aws',
    data: {
      name: 'AWS',
      context: 'EC2, S3, Lambda, RDS. Production deployments and CI/CD pipelines.',
      tier: 'primary',
    },
    status: 'published',
    sortOrder: 5,
  },

  // ── Skills - Extended ──
  {
    type: 'skill',
    slug: 'nextjs',
    data: {
      name: 'Next.js',
      context:
        'App Router, SSR/SSG, API routes. Current frontend framework of choice.',
      tier: 'extended',
    },
    status: 'published',
    sortOrder: 6,
  },
  {
    type: 'skill',
    slug: 'nodejs',
    data: {
      name: 'Node.js',
      context:
        'Express, NestJS backends. Microservices architecture at Stratpoint internship.',
      tier: 'extended',
    },
    status: 'published',
    sortOrder: 7,
  },
  {
    type: 'skill',
    slug: 'docker',
    data: {
      name: 'Docker',
      context:
        'Containerized deployments, multi-stage builds, compose for local dev.',
      tier: 'extended',
    },
    status: 'published',
    sortOrder: 8,
  },
  {
    type: 'skill',
    slug: 'langchain',
    data: {
      name: 'LangChain',
      context: 'LLM orchestration, RAG pipelines, agent frameworks at AI Labs.',
      tier: 'extended',
    },
    status: 'published',
    sortOrder: 9,
  },
  {
    type: 'skill',
    slug: 'spring-boot',
    data: {
      name: 'Spring Boot',
      context:
        'Java internship focus. RESTful services, JPA, microservices patterns.',
      tier: 'extended',
    },
    status: 'published',
    sortOrder: 10,
  },
  {
    type: 'skill',
    slug: 'kubernetes',
    data: {
      name: 'Kubernetes',
      context:
        'Container orchestration, deployments, services. Hands-on during internship.',
      tier: 'extended',
    },
    status: 'published',
    sortOrder: 11,
  },

  // ── Skills - Familiar ──
  {
    type: 'skill',
    slug: 'tensorflow',
    data: {
      name: 'TensorFlow',
      context:
        'Deep learning research. Traffic violation detection, breast cancer prediction models.',
      tier: 'familiar',
    },
    status: 'published',
    sortOrder: 12,
  },
  {
    type: 'skill',
    slug: 'mongodb',
    data: {
      name: 'MongoDB',
      context:
        'Document stores for appropriate use cases. Used alongside PostgreSQL.',
      tier: 'familiar',
    },
    status: 'published',
    sortOrder: 13,
  },
  {
    type: 'skill',
    slug: 'java',
    data: {
      name: 'Java',
      context:
        'Backend development during Stratpoint internship. Spring ecosystem.',
      tier: 'familiar',
    },
    status: 'published',
    sortOrder: 14,
  },
  {
    type: 'skill',
    slug: 'cpp',
    data: {
      name: 'C++',
      context: 'Systems programming coursework. Algorithm implementations.',
      tier: 'familiar',
    },
    status: 'published',
    sortOrder: 15,
  },
  {
    type: 'skill',
    slug: 'nestjs',
    data: {
      name: 'NestJS',
      context:
        'TypeScript backend framework. Modular architecture, decorators.',
      tier: 'familiar',
    },
    status: 'published',
    sortOrder: 16,
  },
  {
    type: 'skill',
    slug: 'php',
    data: {
      name: 'PHP',
      context: 'Legacy project maintenance. Laravel basics.',
      tier: 'familiar',
    },
    status: 'published',
    sortOrder: 17,
  },

  // ── Projects ──
  {
    type: 'project',
    slug: 'arxivian',
    data: {
      num: '01',
      title: 'Arxivian',
      tags: ['Full Stack', 'AI'],
      techStack: [
        'React 19 / TypeScript',
        'FastAPI / Python',
        'LangGraph / LiteLLM',
        'PostgreSQL / pgvector',
        'Redis / Celery',
      ],
      techStackMobile: 'React, FastAPI, LangGraph, pgvector, Redis',
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/spencerjireh/arxivian',
        },
      ],
      descriptions: [
        'An agentic RAG system for academic research. Chat with an AI agent that searches, ingests, summarizes, and explores citations across arXiv papers through a conversational interface backed by a LangGraph workflow and hybrid retrieval.',
        'The agent has access to six specialized tools, decides which to call (potentially in parallel), grades retrieved context for relevance, and streams cited answers back in real time. A communal knowledge base means every ingested paper benefits all users.',
      ],
      highlightsTitle: 'Key Features',
      highlights: [
        'LangGraph-based agent with parallel tool execution and retry loops',
        'Hybrid retrieval combining pgvector HNSW and PostgreSQL GIN/tsvector with RRF',
        'Real-time SSE streaming with Langfuse observability tracing',
        'Celery task queue with Redis for async paper ingestion',
        '466+ tests across unit, API, and LLM-backed evaluation suites',
      ],
    },
    status: 'published',
    sortOrder: 0,
  },
  {
    type: 'project',
    slug: 'eece-consultation-hub',
    data: {
      num: '02',
      title: 'EECE Consultation Hub',
      tags: ['Web App', 'Full Stack'],
      techStack: [
        'React / Next.js',
        'TypeScript',
        'Node.js / Express',
        'PostgreSQL',
        'AWS (EC2, S3)',
      ],
      techStackMobile: 'React, Next.js, TypeScript, Node.js, PostgreSQL',
      links: [
        {
          label: 'Live Site<sup>*</sup>',
          url: 'https://eece-consultation-hub.spencerjireh.com/',
        },
      ],
      extraMeta: [{ label: 'Users', value: '900+' }],
      metaNote: '<sup>*</sup>Active production system - please browse respectfully.',
      descriptions: [
        'An academic consultation platform developed for the Electrical and Electronics Engineering department. The system streamlines the scheduling process between students and faculty members, replacing a manual appointment system.',
        'Successfully deployed to serve over 900 users including students, faculty advisors, and department administrators. Features real-time availability updates, automated notifications, and comprehensive scheduling management.',
      ],
      highlightsTitle: 'Key Features',
      highlights: [
        'Real-time availability and scheduling system',
        'Role-based access for students, faculty, and admins',
        'Automated email notifications for appointments',
        'Dashboard analytics for department reporting',
        'Mobile-responsive design for on-the-go access',
      ],
    },
    status: 'published',
    sortOrder: 1,
  },
  {
    type: 'project',
    slug: 'folionaut',
    data: {
      num: '03',
      title: 'Folionaut',
      tags: ['Full Stack', 'Backend'],
      techStack: [
        'TypeScript / Bun',
        'Express',
        'Turso / Drizzle ORM',
        'Redis',
        'OpenTelemetry / Prometheus',
      ],
      techStackMobile: 'TypeScript, Bun, Express, Turso, Redis',
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/spencerjireh/folionaut',
        },
        {
          label: 'Docs',
          url: 'https://spencerjireh.github.io/folionaut/',
        },
      ],
      descriptions: [
        'An AI and MCP enhanced portfolio content management system. A TypeScript/Express backend featuring a flexible CMS with free-form JSON content, versioning, soft delete, and full audit trail for managing portfolio websites.',
        'Includes an AI-powered chat endpoint with PII obfuscation and tool use, plus a Model Context Protocol (MCP) server that exposes content tools to AI assistants. Built with resilience patterns including circuit breakers, token bucket rate limiting, and graceful degradation.',
      ],
      highlightsTitle: 'Key Features',
      highlights: [
        'Flexible CMS with content versioning and full audit trail',
        'AI chat with PII obfuscation and tool use for content queries',
        'MCP server integration for AI assistant interoperability',
        'Circuit breaker and token bucket rate limiting for resilience',
        'OpenTelemetry tracing and Prometheus metrics for observability',
      ],
    },
    status: 'published',
    sortOrder: 2,
  },
  {
    type: 'project',
    slug: 'cytolens',
    data: {
      num: '04',
      title: 'CytoLens',
      tags: ['Machine Learning', 'Healthcare'],
      techStack: [
        'Python / FastAPI',
        'Svelte',
        'Scikit-learn',
        'Pandas / NumPy',
        'Docker',
      ],
      techStackMobile: 'Python, FastAPI, Svelte, Scikit-learn, Docker',
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/spencerjireh/cytolens',
        },
        {
          label: 'Live Demo',
          url: 'https://cytolens.spencerjireh.com',
        },
      ],
      descriptions: [
        'A breast cancer malignancy predictor designed for use alongside cytology lab measurements. The application analyzes cell nuclei characteristics from fine needle aspirate (FNA) samples to classify tumors as benign or malignant using a Logistic Regression model.',
        'Features an interactive radar chart visualization that maps input measurements against benign and malignant profiles, giving medical staff an intuitive view of the prediction. Built with a FastAPI backend serving the ML model and a Svelte frontend, packaged in a single Docker container.',
      ],
      highlightsTitle: 'Key Features',
      highlights: [
        'Logistic Regression model trained on FNA cell nuclei measurements',
        'Interactive radar chart visualization of prediction profiles',
        'FastAPI backend with Svelte frontend in a single container',
        'Real-time predictions with confidence scoring',
        'Dockerized for consistent deployment across environments',
      ],
    },
    status: 'published',
    sortOrder: 3,
  },
  {
    type: 'project',
    slug: 'quantum-cash',
    data: {
      num: '05',
      title: 'Quantum Cash',
      tags: ['Microservices', 'Backend'],
      techStack: [
        'Java / Spring Boot',
        'Node.js / NestJS',
        'PostgreSQL',
        'Docker / Kubernetes',
        'JWT Authentication',
      ],
      techStackMobile: 'Java, Spring Boot, NestJS, PostgreSQL, Docker',
      links: [
        {
          label: 'GitHub (v1)',
          url: 'https://github.com/spencerjireh/quantum-cash-digital-wallet',
        },
        {
          label: 'GitHub (v2)',
          url: 'https://github.com/spencerjireh/CashDaddy',
        },
      ],
      descriptions: [
        'A digital wallet system built with microservices architecture, designed for scalability and security. The system handles user management, transaction processing, and account services through independent, loosely-coupled services.',
        'Implemented secure JWT-based authentication with refresh token rotation, ensuring user sessions remain protected while maintaining a smooth experience. Each microservice communicates through well-defined APIs and message queues for asynchronous operations.',
      ],
      highlightsTitle: 'Key Features',
      highlights: [
        'Microservices architecture with independent deployment',
        'JWT authentication with secure refresh token handling',
        'PostgreSQL for reliable transaction storage',
        'Containerized with Docker and orchestrated via Kubernetes',
        'RESTful APIs with comprehensive error handling',
      ],
    },
    status: 'published',
    sortOrder: 4,
  },
  {
    type: 'project',
    slug: 'traffic-violation-detection',
    data: {
      num: '06',
      title: 'Traffic Violation Detection',
      tags: ['Research', 'Deep Learning'],
      techStack: ['Python', 'YOLOv7', 'DeepSORT', 'Faster R-CNN', 'OpenCV'],
      techStackMobile: 'Python, YOLOv7, DeepSORT, Faster R-CNN',
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/spencerjireh/YOLOv7-Deepsort-License-Plate-Coding-Detector',
        },
      ],
      extraMeta: [{ label: 'Type', value: 'Research' }],
      descriptions: [
        'A deep learning research project comparing state-of-the-art object detection models for automated traffic violation monitoring. The study evaluates YOLOv7, DeepSORT, and Faster R-CNN for detecting and tracking vehicles in real-time traffic footage.',
        'The research focuses on identifying specific violations such as illegal lane changes, running red lights, and improper turns. Comparative analysis includes accuracy metrics, processing speed, and real-world deployment considerations.',
      ],
      highlightsTitle: 'Research Highlights',
      highlights: [
        'Comparative analysis of YOLO, DeepSORT, and Faster R-CNN',
        'Real-time vehicle detection and tracking',
        'Custom dataset for Philippine traffic scenarios',
        'Performance benchmarking on embedded hardware',
        'Published findings and methodology documentation',
      ],
    },
    status: 'published',
    sortOrder: 5,
  },

  // ── Contact ──
  {
    type: 'contact',
    slug: 'main',
    data: {
      title: "Let's Connect",
      subtitle: 'Available for opportunities',
      email: 'spencercebrian123@gmail.com',
      github: 'https://github.com/spencerjireh',
      linkedin: 'https://www.linkedin.com/in/spencerjireh',
      footer: '\u00a9 2026 Spencer Jireh G. Cebrian',
    },
    status: 'published',
    sortOrder: 0,
  },
];
