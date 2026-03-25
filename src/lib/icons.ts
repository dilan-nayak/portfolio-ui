import type { ComponentType } from "react";
import { Github, Linkedin, Mail, Phone, MapPin, Twitter, MessageCircle } from "lucide-react";
import type { IconKey } from "@/types/portfolio-content";

export const iconMap: Record<IconKey, ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  twitter: Twitter,
  messageCircle: MessageCircle,
};
