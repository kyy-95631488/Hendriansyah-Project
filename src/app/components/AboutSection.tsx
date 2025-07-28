"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaAndroid, FaCode, FaGraduationCap, FaGlobe } from "react-icons/fa";

interface Content {
  id: {
    title: string;
    description1: string;
    description2: string;
    description3: string;
  };
  en: {
    title: string;
    description1: string;
    description2: string;
    description3: string;
  };
}

export default function AboutSection() {
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const content: Content = {
    id: {
      title: "Tentang Saya",
      description1:
        "Saya adalah seorang Full-Stack Developer yang bersemangat dengan keahlian dalam menciptakan solusi digital yang inovatif, skalabel, dan berfokus pada pengguna. Rasa ingin tahu saya mendorong saya untuk mengatasi tantangan kompleks, memberikan pengalaman yang mulus di web, mobile, dan sistem backend.",
      description2:
        "Dengan pengalaman hampir satu tahun di pengembangan Android, saya telah membangun aplikasi mobile yang dinamis menggunakan Kotlin, Jetpack Compose, dan Flutter. Sebagai alumnus <span class='font-semibold'>Bangkit Academy 2024 Batch 2</span>, saya mengasah keterampilan saya dalam pengembangan Android, berkolaborasi dalam proyek dunia nyata yang mengutamakan performa dan pengalaman pengguna.",
      description3:
        "Keahlian saya mencakup JavaScript, TypeScript, React, Next.js, Node.js, PHP, dan pengembangan Android dengan Kotlin dan Flutter. Saya fokus pada penulisan kode yang bersih, mudah dipelihara, dan memanfaatkan pola desain modern untuk menciptakan solusi yang selaras dengan kebutuhan pengguna dan tujuan bisnis.",
    },
    en: {
      title: "About Me",
      description1:
        "I’m a passionate Full-Stack Developer with a knack for crafting innovative, scalable, and user-focused digital solutions. My curiosity drives me to tackle complex challenges, delivering seamless experiences across web, mobile, and backend systems.",
      description2:
        "With nearly a year of hands-on experience in Android development, I’ve built dynamic mobile applications using Kotlin, Jetpack Compose, and Flutter. As a proud <span class='font-semibold'>Bangkit Academy 2024 Batch 2</span> alumnus, I honed my skills in Android development, collaborating on real-world projects that prioritize performance and user experience.",
      description3:
        "My expertise spans JavaScript, TypeScript, React, Next.js, Node.js, PHP, and Android development with Kotlin and Flutter. I focus on writing clean, maintainable code and leveraging modern design patterns to create solutions that align with both user needs and business goals.",
    },
  };

  const skills = [
    { name: "JavaScript", icon: "/images/skills/javascript.png" },
    { name: "TypeScript", icon: "/images/skills/typescript.png" },
    { name: "React", icon: "/images/skills/react.png" },
    { name: "Next.js", icon: "/images/skills/nextjs.png" },
    { name: "Node.js", icon: "/images/skills/nodejs.png" },
    { name: "Android", icon: "/images/skills/android.png" },
    { name: "Kotlin", icon: "/images/skills/kotlin.png" },
    { name: "PHP", icon: "/images/skills/php.png" },
    { name: "Flutter", icon: "/images/skills/flutter.png" },
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
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24"
      aria-labelledby="about-title"
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
        id="about-title"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg"
      >
        {content[language].title}
      </motion.h2>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl border border-blue-500/20 text-base sm:text-lg space-y-6"
      >
        <div className="flex items-start space-x-3">
          <FaCode className="text-blue-400 text-2xl mt-1" aria-hidden="true" />
          <p
            className="text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content[language].description1 }}
          />
        </div>
        <div className="flex items-start space-x-3">
          <FaAndroid className="text-blue-400 text-2xl mt-1" aria-hidden="true" />
          <p
            className="text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content[language].description2 }}
          />
        </div>
        <div className="flex items-start space-x-3">
          <FaGraduationCap className="text-blue-400 text-2xl mt-1" aria-hidden="true" />
          <p
            className="text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content[language].description3 }}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-6" role="list" aria-label="Skills">
          {skills.map((skill, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="flex items-center px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm font-medium"
              role="listitem"
            >
              {skill.icon ? (
                <img
                  src={skill.icon}
                  alt={`${skill.name} icon`}
                  className="w-5 h-5 mr-2"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/500x500";
                  }}
                />
              ) : null}
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}