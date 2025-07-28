"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { auth } from "../auth/firebase/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Define the Project type
interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  platform: "web" | "mobile" | "desktop";
}

export default function ProjectsSection() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const router = useRouter();
  const db = getFirestore();

  // Fetch projects from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const projectsCollection = collection(db, `users/${firebaseUser.uid}/projects`);
          const projectsSnapshot = await getDocs(projectsCollection);
          const projectsData: Project[] = projectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            thumbnailUrl: doc.data().thumbnailUrl,
            platform: doc.data().platform,
          }));
          setProjects(projectsData);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      } else {
        router.push("/");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router, db]);

  // Filter projects based on selected platform
  const filteredProjects =
    selectedPlatform === "all"
      ? projects
      : projects.filter((project) => project.platform === selectedPlatform);

  // Update scroll button states
  const updateScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [filteredProjects]);

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 640 ? 260 : window.innerWidth < 1024 ? 300 : 340;
      containerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 640 ? 260 : window.innerWidth < 1024 ? 300 : 340;
      containerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

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
    <section className="w-full flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 relative overflow-y-auto">
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-400 drop-shadow-lg text-center"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        My Projects
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 text-center"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Explore a collection of my work across web, mobile, and desktop platforms. Each project showcases innovative solutions designed to solve real-world challenges with seamless user experiences and cutting-edge technology.
      </motion.p>

      {/* Platform Selection Dropdown */}
      <motion.div
        className="mb-8 w-full max-w-xs"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="w-full bg-white/5 backdrop-blur-lg border border-blue-500/20 rounded-lg py-2 px-4 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all" className="bg-gray-900">All Platforms</option>
          <option value="web" className="bg-gray-900">Web</option>
          <option value="mobile" className="bg-gray-900">Mobile</option>
          <option value="desktop" className="bg-gray-900">Desktop</option>
        </select>
      </motion.div>

      {/* Project Cards */}
      <div className="w-full max-w-[90rem] mx-auto relative">
        {/* Left Arrow */}
        <motion.button
          className="hidden sm:block absolute left-[-24px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 sm:p-3 rounded-full shadow-lg z-30 hover:scale-105 transition-transform duration-300 disabled:opacity-50"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll Left"
        >
          <FaChevronLeft size={12} className="sm:w-4 sm:h-4" />
        </motion.button>

        <div
          ref={containerRef}
          className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-4 sm:pb-6 snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] touch-auto px-4 sm:px-6 md:px-8 lg:px-10"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {filteredProjects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              className="relative bg-white/5 backdrop-blur-lg p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl border border-blue-500/20 overflow-hidden flex-none w-[260px] sm:w-[300px] lg:w-[340px] snap-center"
              initial={{ x: 30, opacity: 0, scale: 0.95 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 * (index % 3) }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-[160px] sm:h-[180px] lg:h-[220px] mb-4">
                <Image
                  src={project.thumbnailUrl || "https://placehold.co/1920x1080"}
                  alt={project.title}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/1920x1080";
                  }}
                />
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate">{project.title}</h4>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2">{project.description}</p>
              <motion.button
                className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 z-10 relative"
                onClick={() => router.push(`/project/${project.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Details
              </motion.button>
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          className="hidden sm:block absolute right-[-24px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 sm:p-3 rounded-full shadow-lg z-30 hover:scale-105 transition-transform duration-300 disabled:opacity-50"
          onClick={scrollRight}
          disabled={!canScrollRight}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll Right"
        >
          <FaChevronRight size={12} className="sm:w-4 sm:h-4" />
        </motion.button>
      </div>
    </section>
  );
}