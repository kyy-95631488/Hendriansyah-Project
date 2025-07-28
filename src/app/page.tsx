"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HomeSection = dynamic(() => import("./components/HomeSection"), { ssr: true });
const AboutSection = dynamic(() => import("./components/AboutSection"), { ssr: true });
const EducationSection = dynamic(() => import("./components/EducationSection"), { ssr: true });
const SkillsSection = dynamic(() => import("./components/SkillsSection"), { ssr: true });
const ProjectsSection = dynamic(() => import("./components/ProjectsSection"), { ssr: true });
const ContactSection = dynamic(() => import("./components/ContactSection"), { ssr: true });

export default function Home() {
  const [currentSection, setCurrentSection] = useState("home");

  const renderSection = () => {
    switch (currentSection) {
      case "home":
        return <HomeSection />;
      case "about":
        return <AboutSection />;
      case "education":
        return <EducationSection />;
      case "skills":
        return <SkillsSection />;
      case "projects":
        return <ProjectsSection />;
      case "contact":
        return <ContactSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-black text-white font-sans scrollbar-hide">
      <Navbar setCurrentSection={setCurrentSection} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16"
          style={{ willChange: "opacity, transform" }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}