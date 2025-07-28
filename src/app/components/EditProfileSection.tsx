"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { User, Loader2, Save } from "lucide-react";
import { auth } from "../auth/firebase/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

interface UserData {
  email: string | null;
  displayName: string | null;
}

export default function EditProfileSection() {
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ displayName: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData: UserData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "User",
        };
        setUser(userData);
        setFormData({ displayName: firebaseUser.displayName || "" });
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ displayName: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      setStatus("Error: Name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: formData.displayName });
        setUser((prev) => ({
          email: prev?.email ?? null,
          displayName: formData.displayName,
        }));
        setStatus("Profile updated successfully!");
      } else {
        setStatus("Error: No user is currently signed in");
      }
    } catch (error: unknown) {
      // Safely handle the error
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("Error: An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-blue-950 to-black">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 via-blue-950 to-black">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={itemVariants}
        >
          Edit Profile
        </motion.h2>

        <motion.div
          className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-700/50"
          variants={itemVariants}
        >
          <motion.p
            className="text-gray-300 text-center mb-8 text-sm sm:text-base lg:text-lg"
            variants={itemVariants}
          >
            Update your profile information
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="displayName"
                className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
              >
                <User className="w-5 h-5 text-blue-400" /> Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                placeholder="Your name"
                aria-label="Your name"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
              >
                <User className="w-5 h-5 text-blue-400" /> Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-400 placeholder-gray-500 focus:outline-none text-sm sm:text-base"
                placeholder="Your email"
                aria-label="Your email (read-only)"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-sm sm:text-base"
              variants={itemVariants}
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
              aria-disabled={isSubmitting}
              aria-label={isSubmitting ? "Saving profile" : "Save profile"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Profile
                </>
              )}
            </motion.button>
          </form>

          {status && (
            <motion.p
              className={`mt-4 text-sm sm:text-base ${
                status.includes("Error") ? "text-red-400" : "text-green-400"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {status}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}