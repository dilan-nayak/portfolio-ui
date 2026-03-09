export type IconKey =
  | "github"
  | "linkedin"
  | "mail"
  | "phone"
  | "mapPin"
  | "twitter"
  | "messageCircle";

export interface PortfolioContent {
  header: {
    brand: string;
    navItems: Array<{ href: string; label: string }>;
    adminToggle?: {
      label: string;
      openImage?: string;
      closeImage?: string;
      previewImages?: Array<{ src: string; alt: string }>;
    };
  };
  hero: {
    greeting: string;
    firstName: string;
    lastName: string;
    roles: string[];
    description: string;
    primaryButton: { label: string; target: string };
    secondaryButton: { label: string; url: string };
    socialLinks: Array<{
      icon: IconKey;
      label: string;
      href: string;
    }>;
    profileImage: { src: string; alt: string };
  };
  about: {
    title: string;
    titleHighlight: string;
    subtitle?: string;
    heading?: string;
    paragraphs: string[];
    images?: Array<{ src: string; alt: string }>;
    image?: { src: string; alt: string };
  };
  skills: {
    title: string;
    titleHighlight: string;
    stackHeading: string;
    learningHeading: string;
    technologies: Array<{ category: string; techs: string[]; color: string }>;
    learning: Array<{
      title: string;
      author: string;
      courseLink: string;
      status: "completed" | "in-progress";
      progress?: number;
      featuredInOverview?: boolean;
    }>;
  };
  experience: {
    title: string;
    subtitle?: string;
    careerStartDate: string;
    counterLabel: string;
    companies: Array<{
      companyShortName: string;
      companyFullName: string;
      companyUrl: string;
      totalDuration?: string;
      positions: Array<{
        title: string;
        employmentType?: string;
        duration: string;
        location?: string;
        descriptions: string[];
      }>;
    }>;
  };
  projects: {
    title: string;
    titleHighlight: string;
    filters: string[];
    cards: Array<{
      id: number;
      title: string;
      category: string;
      description: string;
      image: string;
      technologies: string[];
      liveUrl: string;
      githubUrl: string;
    }>;
    cta: { liveDemo: string; code: string };
  };
  contact: {
    title: string;
    titleHighlight: string;
    connectHeading: string;
    followHeading: string;
    contactInfo: Array<{
      icon: IconKey;
      title: string;
      content: string;
      href: string;
    }>;
    socialLinks: Array<{
      icon: IconKey;
      name: string;
      href: string;
      color: string;
    }>;
    form: {
      labels: {
        name: string;
        email: string;
        subject: string;
        message: string;
      };
      placeholders: {
        name: string;
        email: string;
        subject: string;
        message: string;
      };
      actions: {
        sending: string;
        submit: string;
      };
      successMessage: string;
      errorMessage: string;
      emailJs: {
        serviceId: string;
        templateId: string;
        publicKey: string;
      };
    };
  };
  status: {
    cards: Array<{
      state: "active" | "inactive";
      title: string;
      description: string;
    }>;
  };
}
