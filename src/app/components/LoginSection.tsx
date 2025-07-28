"use client";

import { useState, ChangeEvent, FormEvent, JSX } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebase/firebase"; // Ensure this path is correct
import Link from "next/link";
import { FirebaseError } from "firebase/app";

// Explicitly type the component to return JSX.Element
const LoginSection: React.FC = (): JSX.Element => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setStatus("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      const err = error as FirebaseError;
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Login
        </motion.h2>

        <motion.div
          className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-700/50"
          variants={itemVariants}
        >
          <motion.p
            className="text-gray-300 text-center mb-8 text-sm sm:text-base lg:text-lg"
            variants={itemVariants}
          >
            Sign in to access your account
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
              >
                <Mail className="w-5 h-5 text-blue-400" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                placeholder="your.email@example.com"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
              >
                <Lock className="w-5 h-5 text-blue-400" /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                placeholder="Your password"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-sm sm:text-base"
              variants={itemVariants}
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Sign In
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

          <motion.div
            className="mt-6 text-center text-sm sm:text-base text-gray-300"
            variants={itemVariants}
          >
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="underline text-blue-400 hover:text-blue-500 transition-colors duration-200"
            >
              Register here
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoginSection;