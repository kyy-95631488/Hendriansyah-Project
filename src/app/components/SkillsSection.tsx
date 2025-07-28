"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGlobe } from "react-icons/fa";
import Image from "next/image";

interface Skill {
  name: string;
  icon: string;
}

interface Content {
  id: { title: string; subtitle: string };
  en: { title: string; subtitle: string };
}

export default function SkillsSection() {
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const content: Content = {
    id: {
      title: "Keterampilan Saya",
      subtitle: "Ini adalah keterampilan yang saya kuasai",
    },
    en: {
      title: "My Skills",
      subtitle: "These are the skills I have mastered",
    },
  };

  const skills: Skill[] = [
    { name: "Kotlin", icon: "/images/skills/kotlin.png" },
    { name: "Java", icon: "/images/skills/java.png" },
    { name: "React", icon: "/images/skills/react.png" },
    { name: "Flutter", icon: "/images/skills/flutter.png" },
    { name: "Next.js", icon: "/images/skills/nextjs.png" },
    { name: "Node.js", icon: "/images/skills/nodejs.png" },
    { name: "TypeScript", icon: "/images/skills/typescript.png" },
    { name: "Supabase", icon: "/images/skills/supabase.png" },
    { name: "Firebase", icon: "/images/skills/firebase.png" },
    { name: "MySql", icon: "/images/skills/mysql.png" },
    { name: "PHP", icon: "/images/skills/php.png" },
    { name: "Javascript", icon: "/images/skills/javascript.png" },
    { name: "Frontend", icon: "/images/skills/frontend.png" },
    { name: "Backend", icon: "/images/skills/backend.png" },
  ];

  useEffect(() => {
    // Simulate loading (replace with actual data fetching logic if needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-blue-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <section
      id="skills"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24"
      aria-labelledby="skills-title"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="relative inline-block text-left">
          <label htmlFor="language-select" className="sr-only">
            Select Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as "id" | "en")}
            className="appearance-none bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-lg px-4 py-2 pr-10 text-sm font-medium border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 cursor-pointer"
          >
            <option value="id" className="bg-gray-900 text-gray-100">
              Bahasa Indonesia
            </option>
            <option value="en" className="bg-gray-900 text-gray-100">
              English
            </option>
          </select>
          <FaGlobe
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </motion.div>

      <motion.h2
        id="skills-title"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg"
      >
        {content[language].title}
      </motion.h2>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-lg sm:text-xl text-gray-300 mb-8"
      >
        {content[language].subtitle}
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="w-full max-w-5xl"
        role="list"
        aria-label="Skills list"
      >
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, index) => (
            <motion.li
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              role="listitem"
            >
              <Image
                src={skill.icon}
                alt={`${skill.name} icon`}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 mb-3"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/500x500";
                }}
                loading={index < 5 ? "eager" : "lazy"}
              />
              <span className="text-sm sm:text-base text-gray-200 text-center">{skill.name}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}