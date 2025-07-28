"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { auth } from "../../../auth/firebase/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { Globe, Smartphone, Monitor } from "lucide-react";

// Define the Project type
interface Project {
  id: string;
  title: string;
  description: string;
  platform: "web" | "mobile" | "desktop";
  technologies: string[];
  technologyIcons: { [key: string]: string };
  thumbnailUrl: string;
  previewImageUrls: string[];
  sourceCodeLink: string;
  startDate: string;
  endDate: string;
}

export default function ProjectDetail() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const db = getFirestore();
  const projectId = params.projectId as string;

  useEffect(() => {
    if (!projectId) {
      setStatus("Error: Invalid project ID");
      router.push("/dashboard");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const projectRef = doc(db, `users/${firebaseUser.uid}/projects`, projectId);
          const projectSnap = await getDoc(projectRef);
          if (projectSnap.exists()) {
            setProject({ id: projectSnap.id, ...projectSnap.data() } as Project);
          } else {
            setStatus("Error: Project not found");
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching project:", error);
          setStatus("Error: Failed to load project");
          router.push("/dashboard");
        }
      } else {
        router.push("/");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, projectId, db]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-blue-950 to-black">
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-blue-950 to-black">
        <p className="text-red-400 text-lg">{status}</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-950 via-blue-950 to-black">
      <motion.div
        className="w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.button
          className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
          onClick={() => router.push("/dashboard")}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft className="w-5 h-5" /> Back to Projects
        </motion.button>

        {/* Project Title and Platform */}
        <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-400">
            {project.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-200">
            {project.platform === "web" && <Globe className="w-6 h-6 text-blue-400" />}
            {project.platform === "mobile" && <Smartphone className="w-6 h-6 text-blue-400" />}
            {project.platform === "desktop" && <Monitor className="w-6 h-6 text-blue-400" />}
            <span className="capitalize">{project.platform}</span>
          </div>
        </motion.div>

        {/* Thumbnail */}
        <motion.div variants={itemVariants} className="mb-8">
          <Image
            src={project.thumbnailUrl || "https://placehold.co/1920x1080"}
            alt={project.title}
            width={1920}
            height={1080}
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain rounded-2xl shadow-xl"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/1920x1080";
            }}
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed">
            {project.description}
          </p>
        </motion.div>

        {/* Technologies */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <motion.div
                key={tech}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={project.technologyIcons[tech] || "/images/skills/default.png"}
                  alt={`${tech} icon`}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = "/images/skills/default.png";
                  }}
                />
                <span className="text-gray-200 text-sm sm:text-base">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dates */}
        {(project.startDate || project.endDate) && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Timeline</h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {project.startDate && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-semibold">Start:</span>
                  <span className="text-gray-200">
                    {new Date(project.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {project.endDate && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-semibold">End:</span>
                  <span className="text-gray-200">
                    {new Date(project.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Source Code Link */}
        {project.sourceCodeLink && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Source Code</h2>
            <a
              href={project.sourceCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <FaLink className="w-5 h-5" /> View Source Code
            </a>
          </motion.div>
        )}

        {/* Preview Images */}
        {project.previewImageUrls.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.previewImageUrls.map((url, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={url || "https://placehold.co/1920x1080"}
                    alt={`Preview image ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="w-full h-[200px] sm:h-[250px] object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/1920x1080";
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}