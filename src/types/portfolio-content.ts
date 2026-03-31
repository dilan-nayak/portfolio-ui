import type { IconLibrary, IconName } from "@/lib/icon-catalog";

export interface IconValue {
  library: IconLibrary;
  icon: IconName;
}

export type LegacyIconKey =
  | "github"
  | "linkedin"
  | "mail"
  | "phone"
  | "mapPin"
  | "twitter"
  | "messageCircle"
  | "email"
  | "website"
  | "globe"
  | "x";

export type IconInput = IconValue | LegacyIconKey;

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
    firstName: string;
    lastName: string;
    secondaryButton: { label: string; url: string };
    socialLinks: Array<{
      icon: IconInput;
      label: string;
      href: string;
    }>;
    profileImage: { src: string; alt: string };
  };
  about: {
    title: string;
    subtitle?: string;
    heading?: string;
    paragraphs: string[];
    images?: Array<{ src: string; alt: string }>;
    image?: { src: string; alt: string };
  };
  skills: {
    title: string;
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
      featured?: boolean;
    }>;
    cta: { liveDemo: string; code: string };
  };
  contact: {
    title: string;
    connectHeading: string;
    followHeading: string;
    contactInfo: Array<{
      icon: IconInput;
      title: string;
      content: string;
      href: string;
    }>;
    socialLinks: Array<{
      icon: IconInput;
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
    inquiryChips?: string[];
  };
  status: {
    cards: Array<{
      state: "active" | "inactive";
      title: string;
      description?: string;
      activeDescription?: string;
      inactiveDescription?: string;
      cta?: {
        label: string;
        href: string;
      };
      visible?: boolean;
    }>;
  };
  ui?: {
    sectionVisibility: {
      home: boolean;
      about: boolean;
      status: boolean;
      skills: boolean;
      experience: boolean;
      projects: boolean;
      contact: boolean;
    };
    theme: {
      lightAccentStart: string;
      lightAccentEnd: string;
      darkAccentStart: string;
      darkAccentEnd: string;
    };
  };
}
