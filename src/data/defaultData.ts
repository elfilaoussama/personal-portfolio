import { PortfolioData } from '@/types/portfolio';

export const defaultPortfolioData: PortfolioData = {
  adminHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
  hero: {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    intro: "Passionate about creating innovative solutions and building exceptional user experiences with modern web technologies.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  about: {
    bio: "With over 5 years of experience in web development, I specialize in creating scalable applications using React, Node.js, and cloud technologies. I'm passionate about clean code, user experience, and continuous learning.",
    interests: ["JavaScript", "React", "Node.js", "AWS", "TypeScript", "Docker"]
  },
  contact: {
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson"
  },
  skills: {
    categories: [
      {
        id: "frontend",
        name: "Frontend",
        icon: "fas fa-code",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vue.js"]
      },
      {
        id: "backend",
        name: "Backend",
        icon: "fas fa-server",
        skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Python"]
      },
      {
        id: "tools",
        name: "Tools & DevOps",
        icon: "fas fa-tools",
        skills: ["AWS", "Docker", "Git", "CI/CD", "Kubernetes"]
      }
    ]
  },
  experience: {
    items: [
      {
        id: "exp1",
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        duration: "2021 - Present",
        description: "Led frontend development for a team of 8, building scalable React applications serving 100k+ users. Implemented modern development practices and improved application performance by 40%.",
        technologies: ["React", "TypeScript", "Team Leadership"]
      },
      {
        id: "exp2",
        title: "Full Stack Developer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        description: "Built full-stack applications from concept to deployment. Worked closely with product and design teams to deliver user-focused solutions in an agile environment.",
        technologies: ["Node.js", "MongoDB", "AWS"]
      }
    ]
  },
  projects: {
    items: [
      {
        id: "proj1",
        title: "E-commerce Platform",
        description: "Full-stack e-commerce solution with payment processing, inventory management, and admin dashboard.",
        technologies: ["React", "Node.js", "Stripe"],
        liveUrl: "#",
        githubUrl: "#",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        id: "proj2",
        title: "Task Management App",
        description: "Collaborative project management tool with real-time updates and team collaboration features.",
        technologies: ["React", "Socket.io", "MongoDB"],
        liveUrl: "#",
        githubUrl: "#",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        id: "proj3",
        title: "Weather Dashboard",
        description: "Beautiful weather application with detailed forecasts, maps, and location-based services.",
        technologies: ["Vue.js", "API Integration", "PWA"],
        liveUrl: "#",
        githubUrl: "#",
        imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      }
    ]
  },
  education: {
    items: [
      {
        id: "edu1",
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        duration: "2015 - 2019",
        description: "Graduated Magna Cum Laude"
      }
    ]
  }
};
