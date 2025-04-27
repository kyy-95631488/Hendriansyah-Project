"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Import your supabase client
import { FaReact, FaNodeJs, FaJava, FaPython } from "react-icons/fa"; // Example icons
import { IoLogoJavascript, IoLogoAndroid } from "react-icons/io"; // Additional icons
import { 
  SiFirebase, SiMysql, SiKotlin, SiJetpackcompose, SiTypescript, 
  SiPhp, SiLaravel, SiCss3, SiHtml5, SiTailwindcss, SiSupabase 
} from "react-icons/si";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";

const technologyIcons = {
  React: <FaReact />,
  "Node.js": <FaNodeJs />,
  Java: <FaJava />,
  Python: <FaPython />,
  Javascript: <IoLogoJavascript />,
  Android: <IoLogoAndroid />,
  Firebase: <SiFirebase />,
  Mysql: <SiMysql />,
  Kotlin: <SiKotlin />,
  Jetpackcompose: <SiJetpackcompose />,
  Typescript: <SiTypescript />,
  Php: <SiPhp />,
  Laravel: <SiLaravel />,
  Css3: <SiCss3 />,
  Html5: <SiHtml5 />,
  Tailwindcss: <SiTailwindcss />,
  Supabase: <SiSupabase />,
};

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const [projectsData, setProjectsData] = useState([]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error.message);
      } else {
        setProjectsData(data); // Set the data to the state
      }
    };

    fetchProjects();
  }, []);

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  // Filter projects based on the selected tag
  const filteredProjects = projectsData.filter((project) =>
    project.tags.includes(tag)
  );

  const getTechnologyIcons = (technologies) => {
    let techArray = [];
    try {
      techArray = Array.isArray(technologies)
        ? technologies
        : JSON.parse(technologies);
    } catch (e) {
      console.error("Failed to parse technologies:", technologies);
    }

    return techArray.map((tech) => {
      const icon = technologyIcons[tech];
      if (!icon) {
        console.warn(`No icon found for technology: ${tech}`);
      }
      return icon;
    });
  };

  return (
    <section id="projects" className="md:pt-24 lg:mt-20">
      <h2 className="text-center text-4xl font-bold text-white mt-4">
        My Projects
      </h2>

      <div className="text-white flex flex-wrap justify-center items-center gap-4 py-6">
        <ProjectTag onClick={handleTagChange} name="All" isSelected={tag === "All"} />
        <ProjectTag onClick={handleTagChange} name="Web" isSelected={tag === "Web"} />
        <ProjectTag onClick={handleTagChange} name="Mobile" isSelected={tag === "Mobile"} />
        <ProjectTag onClick={handleTagChange} name="Desktop" isSelected={tag === "Desktop"} />
      </div>

      <div className="flex justify-center">
        {filteredProjects.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20 lg:gap-12">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                imgUrl={project.imageUrl}
                gitUrl={project.githubLink}
                previewUrl={project.livePreviewLink}
                technologies={getTechnologyIcons(project.technologies)}
              />
            ))}
          </div>
        ) : (
          <div className="text-white text-center mt-8 text-xl">
            There are no projects to tag {tag}.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
