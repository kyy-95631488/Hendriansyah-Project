import React from "react";
import HorizontalGallery from "../navBar/HorizontalGallery";
import { motion } from "framer-motion";

const TechnologiesSection = () => {
  const imagesArray = [
    {
      id: 1,
      url: "/icon/react/react-2.svg",
      alt: "React",
    },
    {
      id: 2,
      url: "/icon/nodejs/nodejs-icon.svg",
      alt: "Node",
    },
    {
      id: 3,
      url: "/icon/css3/css-3.svg",
      alt: "CSS3",
    },
    {
      id: 4,
      url: "/icon/html5/HTML5.svg",
      alt: "HTML",
    },
    {
      id: 5,
      url: "/icon/figma/Figma-logo.svg",
      alt: "FIGMA",
    },
    {
      id: 6,
      url: "/icon/javascript/JavaScript-logo.png",
      alt: "Javascript",
    },
    {
      id: 7,
      url: "/icon/typescript/typescript.svg",
      alt: "Typescript",
    },
    {
      id: 8,
      url: "/icon/postgresql/postgresql.svg",
      alt: "Postgres",
    },
    {
      id: 9,
      url: "/icon/android/android-4.svg",
      alt: "Android",
    },
    {
      id: 10,
      url: "/icon/jetpack-compose/jetpack compose icon_RGB.png",
      alt: "Jetpack Compose",
    },
    {
      id: 11,
      url: "/icon/kotlin/kotlin-1.svg",
      alt: "Kotlin",
    },
    {
      id: 12,
      url: "/icon/java/java-4.svg",
      alt: "Java",
    },
    {
      id: 13,
      url: "/icon/mysql/MySQL_logo.svg",
      alt: "MySQL",
    },
    {
      id: 14,
      url: "/icon/firebase/firebase-1.svg",
      alt: "Firebase",
    },
    {
      id: 15,
      url: "/icon/google-cloud/google-cloud-1.svg",
      alt: "Google Cloud",
    },
    {
      id: 16,
      url: "/icon/azure/Microsoft_Azure_Logo.svg",
      alt: "Azure",
    },
  ];
    
  return (
    <main className="py-10 flex flex-col items-center overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold mt-10 text-transparent bg-clip-text bg-white"
      >
        Technologies I&apos;m Familiar With
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.6 }}
        className="border-b border-secondary-500 sm:flex-row items-center w-3/4"
      ></motion.div>
      <HorizontalGallery imageArray={imagesArray} />
    </main>
  );
};

export default TechnologiesSection;
