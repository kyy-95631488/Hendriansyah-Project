"use client";

import { motion, useInView } from "framer-motion";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setStatus("Message sent successfully!");
      setFormData({ email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("Error: Failed to send message. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="contact-title"
    >
      <motion.div
        className="w-full max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2
          id="contact-title"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-white tracking-tight"
          variants={itemVariants}
        >
          Let’s Connect
        </motion.h2>

        <motion.p
          className="text-gray-300 text-center mb-8 text-sm sm:text-base lg:text-lg"
          variants={itemVariants}
        >
          Got a project or opportunity in mind? Drop me a message!
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-700/50"
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
            >
              <Mail className="w-5 h-5" aria-hidden="true" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="your.email@example.com"
              aria-required="true"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="subject"
              className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
            >
              <MessageSquare className="w-5 h-5" aria-hidden="true" /> Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="What's the big idea?"
              aria-required="true"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="message"
              className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
            >
              <MessageSquare className="w-5 h-5" aria-hidden="true" /> Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none text-sm sm:text-base"
              placeholder="Tell me about your project or idea..."
              aria-required="true"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            variants={itemVariants}
            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" /> Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        {status && (
          <motion.p
            className={`mt-4 text-sm sm:text-base ${
              status.includes("Error") ? "text-red-400" : "text-green-400"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            role="alert"
          >
            {status}
          </motion.p>
        )}

        <motion.div
          className="mt-8 text-center space-y-3 text-sm sm:text-base"
          variants={itemVariants}
        >
          <p className="text-gray-300">Or connect with me directly:</p>
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" aria-hidden="true" />
            <a
              href="mailto:hendriansyahrizkysetiawan@gmail.com"
              className="underline hover:text-blue-400 transition-colors duration-200"
            >
              hendriansyahrizkysetiawan@gmail.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}