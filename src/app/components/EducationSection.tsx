"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGlobe } from "react-icons/fa";

interface Education {
  institution: { id: string; en: string };
  degree: { id: string; en: string };
  period: { id: string; en: string };
  semester: { id: string; en: string };
  cgpa: { id: string; en: string };
  description: { id: string; en: string };
  image: string;
}

interface Content {
  id: { title: string };
  en: { title: string };
}

export default function EducationSection() {
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const content: Content = {
    id: { title: "Pendidikan" },
    en: { title: "Education" },
  };

  const education: Education[] = [
    {
      institution: {
        id: "Universitas Indraprasta PGRI",
        en: "Indraprasta PGRI University",
      },
      degree: {
        id: "Sarjana Teknik Informatika",
        en: "Bachelor of Informatics Engineering",
      },
      period: {
        id: "2022 - Sekarang",
        en: "2022 - Present",
      },
      semester: {
        id: "Semester 6",
        en: "Semester 6",
      },
      cgpa: {
        id: "IPK: 3.29/4.00",
        en: "CGPA: 3.29/4.00",
      },
      description: {
        id: "Menempuh gelar dengan fokus pada pengembangan perangkat lunak, sistem basis data, dan pengembangan aplikasi mobile. Aktif terlibat dalam proyek yang meningkatkan keterampilan teknis dan pemecahan masalah.",
        en: "Pursuing a degree with a focus on software engineering, database systems, and mobile application development. Actively involved in projects enhancing technical skills and problem-solving.",
      },
      image: "/images/education/unindra.png",
    },
    {
      institution: {
        id: "Kampus Merdeka Bangkit Academy",
        en: "Kampus Merdeka Bangkit Academy",
      },
      degree: {
        id: "Kohor Pengembangan Mobile",
        en: "Mobile Development Cohort",
      },
      period: {
        id: "Agustus 2024 - Januari 2025",
        en: "August 2024 - January 2025",
      },
      semester: {
        id: "Tidak Berlaku",
        en: "N/A",
      },
      cgpa: {
        id: "Skor: 89.04/100",
        en: "Score: 89.04/100",
      },
      description: {
        id: "Program intensif yang mengkhususkan diri pada pengembangan Android menggunakan Kotlin. Berkolaborasi dalam proyek dunia nyata untuk membangun aplikasi mobile yang skalabel dan berpusat pada pengguna.",
        en: "Intensive program specializing in Android development using Kotlin. Collaborated on real-world projects to build scalable and user-centric mobile applications.",
      },
      image: "/images/education/bangkit.png",
    },
  ];

  useEffect(() => {
    // Simulate data loading (replace with actual data fetching logic if needed)
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
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="relative inline-block text-left">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "id" | "en")}
            className="appearance-none bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-lg px-4 py-2 pr-10 text-sm font-medium border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 cursor-pointer"
          >
            <option value="id" className="bg-gray-900 text-gray-100">Bahasa Indonesia</option>
            <option value="en" className="bg-gray-900 text-gray-100">English</option>
          </select>
          <FaGlobe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none" />
        </div>
      </motion.div>

      <motion.h2
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
        className="w-full max-w-4xl space-y-6"
      >
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-blue-500/20 shadow-2xl hover:shadow-blue-500/30 transition-shadow duration-300 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6"
          >
            <div className="w-full md:w-1/4 flex-shrink-0">
              <img
                src={edu.image}
                alt={`${edu.institution[language]} logo`}
                className="w-full h-24 object-contain rounded-lg border border-blue-500/20"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/1920x1080";
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">{edu.institution[language]}</h3>
              <p className="text-base sm:text-lg text-cyan-300">{edu.degree[language]}</p>
              <p className="text-sm sm:text-base text-gray-400">{edu.period[language]}</p>
              <p className="text-sm sm:text-base text-gray-400">{edu.semester[language]}</p>
              <p className="text-sm sm:text-base text-gray-400">{edu.cgpa[language]}</p>
              <p className="text-sm sm:text-base text-gray-200 mt-2">{edu.description[language]}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}