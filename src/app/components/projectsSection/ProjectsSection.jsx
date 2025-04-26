"use client";
import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";

const projectsData = [
  {
    id: 1,
    title: "KlinikGo | Clinic Management System Application Based on Java Swing",
    description:
      "KlinikGo is a clinic management system application based on Java Swing, designed to simplify the management of patient, doctor, and clinic service data. This application provides CRUD features, data search, schedule management, and database backup, all with a responsive and user-friendly desktop interface.",
    image: "/projects/java01.png",
    tag: ["All", "Desktop"],
    gitUrl: "https://github.com/kyy-95631488/KlinikGo-Sistem-Manajemen-Klinik-Berbasis-Java-SwingX",
    previewUrl: "https://github.com/kyy-95631488/KlinikGo-Sistem-Manajemen-Klinik-Berbasis-Java-SwingX/releases/download/KlinikGo/KlinikGo.-.Installer.Update.14.04.2025.exe",
    technologies: [
      {
        id: 1,
        name: "JAVA",
        logo: "/icon/java-desktop/icons8-java-480.svg",
      }
    ],
  },
  {
    "id": 2,
    "title": "KidCare | Mobile Solution for Child Health and Stunting Prevention",
    "description": 
      "KidCare is an Android-based mobile application developed using Kotlin and Jetpack Libraries. This app focuses on preventing child stunting with features such as education, nutrition status prediction using a Machine Learning model (TensorFlow Lite), user authentication with Firebase Authentication, and real-time database integration with Firebase. It is designed to provide a modern and responsive user experience.",
    "image": "/projects/mobile01.png",
    "tag": ["All", "Mobile"],
    "gitUrl": "https://github.com/KidCare-Capstone-Project/MobileDev_Apps",
    "previewUrl": "https://github.com/KidCare-Capstone-Project/MobileDev_Apps/releases/download/v2.1.0/app-release.apk",
    "technologies": [
      {
        "id": 1,
        "name": "Android",
        "logo": "/icon/android/android-4.svg"
      },
      {
        "id": 2,
        "name": "Jetpack Compose",
        "logo": "/icon/jetpack-compose/jetpack compose icon_RGB.png"
      },
      {
        "id": 3,
        "name": "Kotlin",
        "logo": "/icon/kotlin/kotlin-1.svg"
      },
      {
        "id": 4,
        "name": "Firebase",
        "logo": "/icon/firebase/firebase-1.svg"
      }
    ]
  },  
];
const ProjectsSection = () => {
  const [tag, setTag] = useState("All");

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };
  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  return (
    <section id="projects" className="md:pt-24 lg:mt-20">
      <h2 className="text-center text-4xl font-bold text-white mt-4   ">
        My Projects
      </h2>

      <div className="text-white flex flex-wrap justify-center items-center gap-4 py-6">

        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Mobile"
          isSelected={tag === "Mobile"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Desktop"
          isSelected={tag === "Desktop"}
        />
      </div>

      <div className="flex justify-center">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20  lg:gap-12 ">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
              technologies={project.technologies}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
