"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { auth } from "../../auth/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { Globe, Smartphone, Monitor, FileText, Code, Calendar, Image as ImageIcon } from "lucide-react";

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
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const router = useRouter();
  const params = useParams();
  const db = getFirestore();
  const projectId = params.projectId as string;

  useEffect(() => {
    if (!projectId) {
      setStatus("Error: Invalid project ID");
      router.push("/");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const projectRef = doc(db, `users/${firebaseUser.uid}/projects`, projectId);
          const projectSnap = await getDoc(projectRef);
          if (projectSnap.exists()) {
            setProject({ id: projectSnap.id, ...projectSnap.data() } as Project);
          } else {
            setStatus("Error: Project not found");
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching project:", error);
          setStatus("Error: Failed to load project");
          router.push("/");
        }
      } else {
        router.push("/");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, projectId, db]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 }); // Reset position when closing modal
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Handle mouse wheel for zooming
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedImage && imageRef.current) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoomLevel((prev) => Math.max(0.5, Math.min(prev + delta, 3)));
      }
    };

    const currentRef = imageRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheel);
      }
    };
  }, [selectedImage]);

  // Handle touch pinch-to-zoom
  useEffect(() => {
    let initialDistance: number | null = null;

    const handleTouchMove = (e: TouchEvent) => {
      if (selectedImage && e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        if (initialDistance !== null) {
          const scaleChange = distance / initialDistance;
          setZoomLevel((prev) => Math.max(0.5, Math.min(prev * scaleChange, 3)));
        }
        initialDistance = distance;
      }
    };

    const handleTouchEnd = () => {
      initialDistance = null;
    };

    const currentRef = imageRef.current;
    if (currentRef) {
      currentRef.addEventListener("touchmove", handleTouchMove, { passive: false });
      currentRef.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("touchmove", handleTouchMove);
        currentRef.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [selectedImage]);

  // Handle mouse dragging
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (selectedImage && zoomLevel > 1) {
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart.current && imageRef.current && zoomLevel > 1) {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        const bounds = imageRef.current.getBoundingClientRect();
        const maxX = (bounds.width * (zoomLevel - 1)) / 2;
        const maxY = (bounds.height * (zoomLevel - 1)) / 2;
        setPosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStart.current = null;
    };

    const currentRef = imageRef.current;
    if (currentRef) {
      currentRef.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousedown", handleMouseDown);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedImage, isDragging, zoomLevel, position]);

  // Handle touch dragging
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (selectedImage && e.touches.length === 1 && zoomLevel > 1) {
        e.preventDefault();
        const touch = e.touches[0];
        dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (selectedImage && e.touches.length === 1 && zoomLevel > 1 && dragStart.current) {
        e.preventDefault();
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.current.x;
        const newY = touch.clientY - dragStart.current.y;
        const bounds = imageRef.current?.getBoundingClientRect();
        if (bounds) {
          const maxX = (bounds.width * (zoomLevel - 1)) / 2;
          const maxY = (bounds.height * (zoomLevel - 1)) / 2;
          setPosition({
            x: Math.max(-maxX, Math.min(maxX, newX)),
            y: Math.max(-maxY, Math.min(maxY, newY)),
          });
        }
      }
    };

    const handleTouchEnd = () => {
      dragStart.current = null;
    };

    const currentRef = imageRef.current;
    if (currentRef) {
      currentRef.addEventListener("touchstart", handleTouchStart, { passive: false });
      currentRef.addEventListener("touchmove", handleTouchMove, { passive: false });
      currentRef.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("touchstart", handleTouchStart);
        currentRef.removeEventListener("touchmove", handleTouchMove);
        currentRef.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [selectedImage, zoomLevel, position]);

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
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
          onClick={() => router.push("/")}
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
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain rounded-2xl shadow-xl cursor-pointer border-2 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/1920x1080";
            }}
            onClick={() => {
              setSelectedImage(project.thumbnailUrl || "https://placehold.co/1920x1080");
              setZoomLevel(1);
              setPosition({ x: 0, y: 0 }); // Reset position when opening new image
            }}
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" /> Description
          </h2>
          <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed bg-gray-800/50 p-4 rounded-lg">
            {project.description}
          </p>
        </motion.div>

        {/* Technologies */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-400" /> Technologies
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <motion.div
                key={tech}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
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
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" /> Timeline
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-gray-800/50 p-4 rounded-lg">
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
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaLink className="w-6 h-6 text-blue-400" /> Source Code
            </h2>
            <a
              href={project.sourceCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 bg-gray-800/50 px-4 py-2 rounded-lg border border-blue-500/20 hover:border-blue-500/50"
            >
              <FaLink className="w-5 h-5" /> View Source Code
            </a>
          </motion.div>
        )}

        {/* Preview Images */}
        {project.previewImageUrls.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-400" /> Screenshots
            </h2>
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
                    className="w-full h-[200px] sm:h-[250px] object-contain rounded-lg shadow-md cursor-pointer border-2 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/1920x1080";
                    }}
                    onClick={() => {
                      setSelectedImage(url || "https://placehold.co/1920x1080");
                      setZoomLevel(1);
                      setPosition({ x: 0, y: 0 }); // Reset position when opening new image
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedImage(null);
              setZoomLevel(1);
              setPosition({ x: 0, y: 0 }); // Reset position when closing modal
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-4xl w-full m-4 overflow-hidden"
              ref={imageRef}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: "center",
                  cursor: zoomLevel > 1 ? "move" : "default",
                }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={selectedImage}
                  alt="Zoomed image"
                  width={1920}
                  height={1080}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg border-2 border-blue-500/50"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/1920x1080";
                  }}
                />
              </motion.div>
              <button
                className="absolute top-2 right-2 bg-gray-800/80 text-white rounded-full p-2 hover:bg-gray-700/80 transition-colors"
                onClick={() => {
                  setSelectedImage(null);
                  setZoomLevel(1);
                  setPosition({ x: 0, y: 0 }); // Reset position when closing modal
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}