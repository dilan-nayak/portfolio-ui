import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send } from "lucide-react";
import { iconMap } from "@/lib/icons";
import type { IconKey, PortfolioContent } from "@/types/portfolio-content";

interface ContactProps {
  content: PortfolioContent["contact"];
}

const Contact = ({ content }: ContactProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.company.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const publicKey =
        content.form.emailJs.publicKey || import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Missing EmailJS public key");
      }

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: content.form.emailJs.serviceId,
          template_id: content.form.emailJs.templateId,
          user_id: publicKey,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            reply_to: formData.email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`EmailJS failed with status ${response.status}`);
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", company: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExternalOrProtocolLink = (href: string) =>
    /^(https?:|mailto:|tel:)/i.test(href);

  const renderSocialIcon = (icon: IconKey) => {
    const Icon = iconMap[icon] ?? iconMap.mail;
    return <Icon className="w-6 h-6" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const quickIntents = [
    "Job Opportunity",
    "Freelance Project",
    "Collaboration",
    "Feature Suggestion",
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="py-16 md:py-24 bg-transparent"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-left mb-10 md:mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-6">
              {content.title}{" "}
              <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-8">
                {content.connectHeading}
              </h3>

              <div className="space-y-6 mb-8">
                {content.contactInfo.map((info) => {
                  const Icon = iconMap[info.icon] ?? iconMap.mail;

                  return (
                    <motion.a
                      key={info.title}
                      whileHover={{ x: 10 }}
                      href={info.href}
                      target={isExternalOrProtocolLink(info.href) ? "_blank" : undefined}
                      rel={isExternalOrProtocolLink(info.href) ? "noreferrer" : undefined}
                      className="flex items-center gap-4 p-4 theme-surface bg-zinc-200 dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold theme-text-primary text-zinc-900 dark:text-zinc-100">
                          {info.title}
                        </h4>
                        <p className="theme-text-secondary text-zinc-600 dark:text-zinc-400">
                          {info.content}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              <div>
                <h4 className="text-lg font-semibold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-4">
                  {content.followHeading}
                </h4>
                <div className="flex gap-4">
                  {content.socialLinks.map((social) => {
                    return (
                      <motion.a
                        key={social.name}
                        whileHover={{ scale: 1.2, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        href={social.href}
                        target={isExternalOrProtocolLink(social.href) ? "_blank" : undefined}
                        rel={isExternalOrProtocolLink(social.href) ? "noreferrer" : undefined}
                        className={`p-3 theme-surface bg-zinc-200 dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 theme-text-secondary text-zinc-600 dark:text-zinc-400 ${social.color}`}
                        aria-label={social.name}
                      >
                        {renderSocialIcon(social.icon)}
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {quickIntents.map((intent) => (
                    <button
                      key={intent}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, subject: intent }))
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        formData.subject === intent
                          ? "theme-accent-border border-[#8f332a] dark:border-red-500 text-[#8f332a] dark:text-red-300 bg-[#8f332a]/10 dark:bg-red-500/10"
                          : "border-zinc-300 dark:border-zinc-700 theme-text-secondary text-zinc-700 dark:text-zinc-300 hover:border-[#8f332a]/60 dark:hover:border-red-500/60"
                      }`}
                    >
                      {intent}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium theme-text-secondary text-zinc-700 dark:text-zinc-200 mb-2"
                    >
                      {content.form.labels.name}
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 theme-surface bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#8f332a] dark:focus:ring-red-500 focus:border-transparent transition-all duration-200 theme-text-primary text-zinc-900 dark:text-zinc-100"
                      placeholder={content.form.placeholders.name}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium theme-text-secondary text-zinc-700 dark:text-zinc-200 mb-2"
                    >
                      {content.form.labels.email}
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 theme-surface bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#8f332a] dark:focus:ring-red-500 focus:border-transparent transition-all duration-200 theme-text-primary text-zinc-900 dark:text-zinc-100"
                      placeholder={content.form.placeholders.email}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium theme-text-secondary text-zinc-700 dark:text-zinc-200 mb-2"
                  >
                    {content.form.labels.subject}
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 theme-surface bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#8f332a] dark:focus:ring-red-500 focus:border-transparent transition-all duration-200 theme-text-primary text-zinc-900 dark:text-zinc-100"
                    placeholder={content.form.placeholders.subject}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium theme-text-secondary text-zinc-700 dark:text-zinc-200 mb-2"
                  >
                    {content.form.labels.message}
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 theme-surface bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#8f332a] dark:focus:ring-red-500 focus:border-transparent transition-all duration-200 theme-text-primary text-zinc-900 dark:text-zinc-100 resize-none"
                    placeholder={content.form.placeholders.message}
                  />
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(220, 38, 38, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {content.form.actions.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {content.form.actions.submit}
                    </>
                  )}
                </motion.button>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700/60 rounded-xl"
                  >
                    <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                      {content.form.successMessage}
                    </p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700/60 rounded-xl"
                  >
                    <p className="text-red-800 dark:text-red-300 font-medium">
                      {content.form.errorMessage}
                    </p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
