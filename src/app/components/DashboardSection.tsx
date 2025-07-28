"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { auth } from "../auth/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { User, LogOut, Home, Briefcase, Loader2, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2
import PopupMessage from "./PopupMessage";

interface UserData {
  email: string | null;
  displayName: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  platform: string;
  thumbnailUrl: string;
  previewImageUrls: string[];
  createdAt: string;
}

export default function DashboardSection() {
  const [user, setUser] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const router = useRouter();
  const db = getFirestore();

  // Check authentication status and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "User",
        });
        // Fetch projects from Firestore
        const querySnapshot = await getDocs(collection(db, `users/${firebaseUser.uid}/projects`));
        const projectData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setProjects(projectData);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error: unknown) {
      setPopup({ message: "Failed to log out. Please try again.", type: "error" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle project deletion with SweetAlert2
  const handleDeleteProject = async (projectId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteDoc(doc(db, `users/${user.uid}/projects/${projectId}`));
          setProjects(projects.filter((project) => project.id !== projectId));
          setPopup({ message: "Project deleted successfully!", type: "success" });
          Swal.fire("Deleted!", "Your project has been deleted.", "success");
        }
      } catch (error: unknown) {
        setPopup({ message: "Failed to delete project. Please try again.", type: "error" });
        Swal.fire("Error!", "Failed to delete project. Please try again.", "error");
      }
    }
  };

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const sidebarVariants: Variants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-blue-950 to-black">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-screen flex bg-gradient-to-b from-gray-950 via-blue-950 to-black text-white">
      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 w-64 h-full bg-gray-900/80 backdrop-blur-md border-r border-gray-700/50 shadow-2xl md:flex flex-col p-6 space-y-6 hidden"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={itemVariants}
        >
          Dashboard
        </motion.div>
        <nav className="flex-1 space-y-2">
          {[
            { id: "home", label: "Home", icon: Home, href: "/" },
            { id: "overview", label: "Overview", icon: Home, href: "/dashboard" },
            { id: "profile", label: "Profile", icon: User, href: "/dashboard/edit-profile" },
            { id: "projects", label: "Projects", icon: Briefcase, href: "/dashboard/add-project" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-200 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <motion.button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-200 rounded-lg bg-red-500/10 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: isLoggingOut ? 1 : 1.05 }}
          whileTap={{ scale: isLoggingOut ? 1 : 0.95 }}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" /> Logout
            </>
          )}
        </motion.button>
      </motion.aside>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 shadow-lg z-50">
        <div className="flex justify-around items-center py-3 px-4">
          {[
            { id: "home", label: "Home", icon: Home, href: "/" },
            { id: "overview", label: "Overview", icon: Home, href: "/dashboard" },
            { id: "profile", label: "Profile", icon: User, href: "/dashboard/edit-profile" },
            { id: "projects", label: "Projects", icon: Briefcase, href: "/dashboard/add-project" },
            { id: "logout", label: "Logout", icon: LogOut, href: "#", onClick: handleLogout },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.onClick}
              className={`flex flex-col items-center text-xs font-medium ${
                item.id === "overview" ? "text-cyan-300" : "text-gray-200"
              } ${isLoggingOut && item.id === "logout" ? "opacity-50" : ""}`}
            >
              <item.icon
                size={20}
                className={item.id === "overview" ? "stroke-cyan-300" : "stroke-gray-200"}
              />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <motion.main
        className="flex-1 md:ml-64 p-6 md:p-8 lg:p-12 overflow-y-auto relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={itemVariants}
        >
          Welcome, {user?.displayName || "User"}!
        </motion.h1>

        {/* User Profile Card */}
        <motion.div
          className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700/50 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Profile</h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              <span className="font-medium">Email:</span> {user?.email || "N/A"}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Name:</span> {user?.displayName || "N/A"}
            </p>
            <Link
              href="/dashboard/edit-profile"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300"
            >
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700/50"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Recent Projects</h2>
            <Link
              href="/dashboard/add-project"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300"
            >
              Add Project
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white/5 p-4 rounded-lg border border-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  {project.thumbnailUrl && (
                    <div className="relative w-full aspect-[4/3] mb-2">
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-white">{project.title}</h3>
                  <p className="text-sm text-gray-300">{project.description}</p>
                  <p className="text-sm text-cyan-400">Platform: {project.platform}</p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/dashboard/edit-project/${project.id}`}
                      className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-all duration-300"
                    >
                      <Edit className="w-4 h-4 inline-block mr-1" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="inline-block px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-500 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4 inline-block mr-1" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-300">No projects found. Add a project to get started!</p>
            )}
          </div>
        </motion.div>

        {/* Popup Message */}
        {popup && (
          <PopupMessage
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup(null)}
            duration={3000}
          />
        )}
      </motion.main>
    </section>
  );
}