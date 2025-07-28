"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { Home, User, Briefcase, Mail, GraduationCap, Code } from "lucide-react";

interface NavbarProps {
  setCurrentSection: Dispatch<SetStateAction<string>>;
}

export default function Navbar({ setCurrentSection }: NavbarProps) {
  const [currentSection, setCurrentSectionLocal] = useState("home");
  const sections = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setCurrentSectionLocal(section);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-4 left-0 right-0 z-50 justify-center">
        <motion.div
          className="bg-black/30 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-blue-500/30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className={`relative px-4 py-2 text-sm uppercase tracking-widest font-medium cursor-pointer transition-colors duration-300 ${
                  currentSection === section.id ? "text-cyan-300" : "text-gray-200"
                }`}
                whileHover={{ scale: 1.1, color: "#38BDF8" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSectionChange(section.id)}
              >
                {section.label}
                {currentSection === section.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"
                    layoutId="underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-t border-blue-500/30 shadow-lg">
        <div className="flex justify-around items-center py-3 px-4">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              className={`flex flex-col items-center text-xs font-medium ${
                currentSection === section.id ? "text-cyan-300" : "text-gray-200"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSectionChange(section.id)}
            >
              <section.icon
                size={20}
                className={currentSection === section.id ? "stroke-cyan-300" : "stroke-gray-200"}
              />
              <span>{section.label}</span>
              {currentSection === section.id && (
                <motion.div
                  className="w-1 h-1 rounded-full bg-cyan-400 mt-1"
                  layoutId="mobile-underline"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </nav>
    </>
  );
}