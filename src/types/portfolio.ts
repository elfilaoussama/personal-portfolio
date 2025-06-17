export interface PortfolioData {
  adminHash?: string;
  hero: {
    name: string;
    title: string;
    intro: string;
    profileImage?: string;
  };
  about: {
    bio: string;
    interests: string[];
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  skills: {
    categories: SkillCategory[];
  };
  experience: {
    items: Experience[];
  };
  projects: {
    items: Project[];
  };
  education: {
    items: Education[];
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  duration: string;
  description?: string;
}
