"use client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import TabButton from "./TabButton";
import { motion } from "framer-motion";

const itemVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-4">
        <li>Java</li>
        <li>Kotlin (Android Development)</li>
        <li>Jetpack Compose</li>
        <li>Android Studio</li>
        <li>React</li>
        <li>JavaScript</li>
        <li>TypeScript</li>
        <li>HTML/CSS</li>
        <li>PHP</li>
        <li>MySQL</li>
        <li>Firebase</li>
        <li>Azure</li>
        <li>Cloud Computing</li>
        <li>Java Swing</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-4">
        <li>
          <a href="https://unindra.ac.id/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">
            Informatics Engineering at Indraprasta PGRI University
          </a> - 2022 - Present, CGPA: 3.29/4.00
        </li>
        <li>
          <a href="https://grow.google/intl/id_id/bangkit/?tab=machine-learning" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">
            Kampus Merdeka Bangkit Academy - Mobile Development Cohort
          </a> - August 2024 - January 2025, CGPA: 89.04/100
        </li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-4">
        <li><a href="https://drive.google.com/file/d/1mnqdC01VPYiZiVm_WhjhFFDphmc2URJO/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Certificate of Completion Bangkit, specializing in Mobile Development (Bangkit Academy 2024 Batch 2)</a></li>
        <li><a href="https://drive.google.com/file/d/1_QxR3EP2fRGfbdwOoTtnbJNJ1huBhbvL/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Tech Talk 4.0: The Future of AI in Web Development (GDSC Widyatama University)</a></li>
        <li><a href="https://drive.google.com/file/d/1-nMaWa4dFhRfcAD-0JFMLACz546NXbgJ/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Sertifikat Kehadiran Event [Soft Skill Webinar #3] Critical Thinking (DBS Foundation Coding Camp 2024)</a></li>
        <li><a href="https://drive.google.com/file/d/1dya-AzFT74bKACSYqhRX057glYKacweX/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Sertifikat Kehadiran Event [Offline] DBS Foundation Coding Camp 2024 Upskill Gathering: Soft Skill Seminar & Front-End Web Mini Workshop</a></li>
        <li><a href="https://drive.google.com/file/d/1L2wce4xvyVYtMyQYwJ0c5qd1bay9owuz/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">[Soft Skill Webinar #4] Adaptability and Resilience (DBS Foundation Coding Camp 2024)</a></li>
        <li><a href="https://drive.google.com/file/d/10SJMlyJI8z-uWjSBttc4uwEk887uiDiM/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">[Soft Skill Webinar #5] Project Management (DBS Foundation Coding Camp 2024)</a></li>
        <li><a href="https://drive.google.com/file/d/1PurTfPS42TW3eamLlnktliZgKQkNL6FN/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Career Session Android: Memulai Karir Sebagai Android Developer (GDSC Mulawarman University)</a></li>
        <li><a href="https://drive.google.com/file/d/12aqwz3LerfaaXq4Dxpevu5GUtAp8YiKY/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">DevCoach 141: Back-End | Membangun Software dengan Prinsip Clean Code dan Design Pattern (Dicoding Event)</a></li>
        <li><a href="https://drive.google.com/file/d/1DVP0RWc22-PWnQ_Joth5rOFX2TGgtP-Z/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">DevCoach 142: iOS | Akses Data dari Server dalam Aplikasi iOS dengan URL Session (Dicoding Event)</a></li>
        <li><a href="https://drive.google.com/file/d/1so82qrY9Un35Qpy1f0Rs-hIRFSfs67dA/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Starting the basics of a Cloud Engineer (Rosyid Mubarak - Dicoding Event)</a></li>
        <li><a href="https://drive.google.com/file/d/1po8Z1AbzvlvZOfWdcs10awFYxQchK0VG/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">DevCoach 152: ML Android | Deploy Custom Model yang Ringan dan Cepat? Kenalin, TensorFlow Lite (Dicoding Event)</a></li>
        <li><a href="https://www.dicoding.com/certificates/QLZ946O37P5D" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Dasar Pemrograman Web (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/07Z6WJEGMZQR" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Dasar Pemrograman JavaScript (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/QLZ97KV4DP5D" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Membuat Front-End Web untuk Pemula (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/N9ZOY7JMYPG5" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Pengenalan ke Logika Pemrograman (Programming Logic 101) (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/1RXY2MJL9XVM" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Dasar Git dengan GitHub (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/1RXY2YL53XVM" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Membuat Aplikasi Android untuk Pemula (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/QLZ9VKEVMX5D" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Dasar AI (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/07Z60OJDMZQR" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Memulai Pemrograman dengan Kotlin (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/98XW5RJEJPM3" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Penerapan Machine Learning untuk Android (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/L4PQ54J57ZO1" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Belajar Fundamental Aplikasi Android (Dicoding Indonesia)</a></li>
        <li><a href="https://www.dicoding.com/certificates/JLX14GE2NX72" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-700">Memulai Dasar Pemrograman untuk Menjadi Pengembang Software (Dicoding Indonesia)</a></li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section
      className="text-white py-8 md:py-20 lg:py-24"
      id="about"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 xl:gap-12 px-4 xl:px-16">
        <motion.div
          variants={itemVariants}
          initial="initial"
          whileInView="animate"
          viewport={{
            once: true,
          }}
          transition={{ delay: 0.1 }}
          className="rounded-lg flex items-center justify-center sm:h-80 md:h-full"
        >
          <Image
            src="/images/gambar-about.png"
            width="500"
            height="500"
            alt="About Me"
            className="object-cover w-full h-full rounded-lg"
          />
        </motion.div>

        <div className="flex flex-col justify-center h-full text-left space-y-6">
          <motion.h2
            variants={itemVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            About Me
          </motion.h2>
          <motion.p
            variants={itemVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            transition={{ delay: 0.3 }}
            className="text-base lg:text-lg leading-relaxed"
          >
            I&apos;m a software developer with experience in Android Studio, Jetpack Compose, Kotlin, Java (Android), Java Desktop (NetBeans), PHP, HTML, MySQL, Firebase, Azure, and React. I specialize in building interactive and responsive applications. My skill set spans mobile development, web development, and cloud technologies, allowing me to create robust, scalable solutions. I&apos;m passionate about delivering seamless user experiences and collaborating effectively in agile environments. Let&apos;s build something amazing together!
          </motion.p>


          <motion.div
            variants={itemVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
              className="flex-grow"
            >
              Skills
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
              className="flex-grow"
            >
              Education
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
              className="flex-grow"
            >
              Certifications
            </TabButton>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-h-48 overflow-y-auto scrollbar-hide"
          >
            {TAB_DATA.find((t) => t.id === tab).content}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
