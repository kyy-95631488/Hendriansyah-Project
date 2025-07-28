"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

export default function HomeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, spring);
  const mouseYSpring = useSpring(mouseY, spring);
  const tiltX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const tiltY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={ref}
      className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 py-20 space-y-16 text-center relative"
    >
      {/* Avatar Card */}
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY }}
        className="relative group w-64 h-64 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden"
      >
        <div className="absolute inset-0 rounded-full animate-pulse bg-white/5 blur-xl z-0" />
        <Image
          src="/images/pribadi-kartun.png"
          alt="Profile"
          fill
          className="object-cover rounded-full z-10 relative transition-transform duration-500 group-hover:scale-105"
        />
        {/* Orbit Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-[1.5px] border-blue-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Nama */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-5xl sm:text-6xl font-bold tracking-tight relative"
      >
        <span className="relative inline-block group">
          <span className="block">Hendriansyah</span>
          <motion.span
            className="absolute left-0 -bottom-1 h-[3px] w-full bg-blue-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4 }}
          />
        </span>{" "}
        Rizky Setiawan
      </motion.h1>

      {/* Deskripsi */}
      <motion.p
        initial={{ opacity: 0, y: 60 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg sm:text-xl max-w-2xl text-gray-400 leading-relaxed font-medium"
      >
        Passionate about building precise, scalable, and user-centric digital solutions as a{" "}
        <span className="text-blue-400 font-semibold">Full-Stack Developer</span>.
      </motion.p>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="flex gap-6"
      >
        {[
          {
            icon: <FaGithub size={24} />,
            href: "https://github.com/kyy-95631488",
            label: "GitHub",
          },
          {
            icon: <FaLinkedin size={24} />,
            href: "https://www.linkedin.com/in/hendriansyah-rizky-setiawan-8b4a68308/",
            label: "LinkedIn",
          },
          {
            icon: <FaInstagram size={24} />,
            href: "https://www.instagram.com/cerberus404x/",
            label: "Instagram",
          },
        ].map(({ icon, href, label }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-md hover:shadow-blue-500/10 transition-all"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-white">{icon}</div>
            <span className="sr-only">{label}</span>
          </motion.a>
        ))}
      </motion.div>

      {/* Resume Button */}
      <motion.a
        href="/documents/CV_-_Hendriansyah_Rizky_Setiawan_Full-Stack_Developer.pdf"
        download
        className="relative inline-flex items-center justify-center px-8 py-3 bg-blue-500/10 text-white rounded-xl overflow-hidden border border-blue-500/30 shadow-lg backdrop-blur-md font-semibold text-base hover:scale-105 transition-transform duration-300"
        whileTap={{ scale: 0.95 }}
      >
        <span className="z-10">Download CV</span>
        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md" />
        </motion.div>
        {/* Pulsing Border */}
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-blue-500/10 group-hover:ring-blue-500/30 animate-pulse pointer-events-none" />
      </motion.a>
    </section>
  );
}