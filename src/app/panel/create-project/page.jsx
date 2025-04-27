"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Footer from "../../components/footer/Footer"; // import Footer
import ParticlesComponent from "../../components/particles/particlesreact"; // import Particles
import { motion } from "framer-motion"; // Add motion for animations
import { FaReact, FaNodeJs, FaJava, FaPython } from "react-icons/fa"; // Example icons
import { IoLogoJavascript } from "react-icons/io"; // Add additional icons for Kotlin, Android, Firebase, MySQL
import { IoLogoAndroid } from "react-icons/io5";
import { SiFirebase, SiMysql, SiKotlin, SiJetpackcompose, SiTypescript, SiPhp, SiLaravel, SiCss3, SiHtml5, SiTailwindcss, SiSupabase } from "react-icons/si";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [technologies, setTechnologies] = useState([]); // New state for selected technologies
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [livePreviewLink, setLivePreviewLink] = useState(""); // New state for Live Preview Link
  const [githubLink, setGithubLink] = useState(""); // New state for GitHub Link

  const handleTagChange = (tag) => {
    setTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag); // Remove tag if already selected
      } else {
        if (prevTags.length < 2) {
          return [...prevTags, tag]; // Add tag if less than 2 are selected
        } else {
          toast.error("You can only select 2 tags.");
          return prevTags;
        }
      }
    });
  };

  const handleTechChange = (tech) => {
    setTechnologies((prevTechnologies) => {
      if (prevTechnologies.includes(tech)) {
        return prevTechnologies.filter((t) => t !== tech); // Remove tech if already selected
      } else {
        return [...prevTechnologies, tech]; // Add tech to the selected list
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !description || tags.length === 0 || technologies.length === 0) {
    toast.error("Please fill in all fields and select at least one tag and technology!");
    return;
  }

  setLoading(true);

  let imageUrl = "";
  if (image) {
    const { data, error } = await supabase.storage
      .from("project-images")
      .upload(`public/${image.name}`, image);
  
    if (error) {
      toast.error("Error uploading image");
      console.error("Supabase upload error:", error);
    } else {
      console.log("Uploaded data:", data);
      imageUrl = data?.publicURL || `https://cbpzbbjczpxfwmffalbf.supabase.co/storage/v1/object/public/project-images/${data?.path}`;
    }
  }  

  const { data, error } = await supabase
    .from("projects")
    .insert([{ title, description, tags, technologies, imageUrl, livePreviewLink, githubLink }]);

  setLoading(false);

  if (error) {
    toast.error(`Failed to add project: ${error.message}`);
  } else {
    toast.success("Project added successfully!");
    setTitle("");
    setDescription("");
    setTags([]);
    setTechnologies([]); // Clear selected technologies after submission
    setImage(null);
    setImagePreview(null);
    setLivePreviewLink(""); // Clear live preview link after submission
    setGithubLink(""); // Clear GitHub link after submission
    setTimeout(() => {
      window.location.href = "./dashboard"; // redirect to dashboard
    }, 1500);
  }
};

  return (
    <main className="flex flex-col min-h-screen bg-[#121212] relative overflow-x-hidden">
      <ToastContainer />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700 z-20">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-grow items-center justify-center pt-24 md:pt-28 container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-md bg-[#18191E] border-2 border-[#33353F] shadow-md rounded-2xl p-6">
          <h1 className="text-3xl font-extrabold text-center text-blue-500 mb-6">
            Add New Project
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-white block mb-1">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
                placeholder="Enter project title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-white block mb-1">Project Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
                rows="4"
                placeholder="Enter project description"
              ></textarea>
            </div>

            {/* Tags Selection */}
            <div className="flex flex-wrap gap-4 mb-4">
              {["All", "Web", "Mobile", "Desktop"].map((tag) => (
                <div
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`cursor-pointer text-white px-4 py-2 rounded-full border-2 transition-colors duration-300 ${
                    tags.includes(tag)
                      ? "bg-blue-500 border-blue-500"
                      : "bg-slate-700 border-slate-500 hover:bg-blue-600 hover:border-blue-600"
                  }`}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* Technologies Selection */}
            <div className="flex flex-wrap gap-4 mb-4">
              {[
                { name: "React", icon: <FaReact /> },
                { name: "Node.js", icon: <FaNodeJs /> },
                { name: "Java", icon: <FaJava /> },
                { name: "Python", icon: <FaPython /> },
                { name: "Javascript", icon: <IoLogoJavascript /> }, // Replace with appropriate icon
                { name: "Android", icon: <IoLogoAndroid /> }, // Icon for Android
                { name: "Firebase", icon: <SiFirebase /> }, // Firebase icon
                { name: "MySQL", icon: <SiMysql /> }, // MySQL icon
                { name: "Kotlin", icon: <SiKotlin /> }, // MySQL icon
                { name: "Jetpackcompose", icon: <SiJetpackcompose /> }, // MySQL icon
                { name: "Typescript", icon: <SiTypescript /> }, // MySQL icon
                { name: "PHP", icon: <SiPhp /> }, // MySQL icon
                { name: "Laravel", icon: <SiLaravel /> },
                { name: "Css3", icon: <SiCss3 /> },
                { name: "Html5", icon: <SiHtml5 /> },
                { name: "Tailwindcss", icon: <SiTailwindcss /> },
                { name: "Supabase", icon: <SiSupabase /> },
              ].map((tech) => (
                <div
                  key={tech.name}
                  onClick={() => handleTechChange(tech.name)}
                  className={`cursor-pointer text-white px-4 py-2 rounded-full border-2 transition-colors duration-300 ${
                    technologies.includes(tech.name)
                      ? "bg-blue-500 border-blue-500"
                      : "bg-slate-700 border-slate-500 hover:bg-blue-600 hover:border-blue-600"
                  } flex items-center gap-2`}
                >
                  {tech.icon} {tech.name}
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-white block mb-1">Upload Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-full h-auto rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Live Preview Link */}
            <div>
              <label className="text-white block mb-1">Live Preview Link</label>
              <input
                type="url"
                value={livePreviewLink}
                onChange={(e) => setLivePreviewLink(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
                placeholder="Enter live preview link"
              />
            </div>

            {/* GitHub Link */}
            <div>
              <label className="text-white block mb-1">GitHub Link</label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none"
                placeholder="Enter GitHub repository link"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow mt-4 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Project"}
            </button>
            <Link
              href="./dashboard"
              className="block text-center text-gray-400 hover:text-white text-sm mt-2"
            >
              ← Back to Dashboard
            </Link>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Particles Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
    </main>
  );
};

export default CreateProject;
