"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Image from "next/image";

const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const HeroSection = () => {
  return (
    <motion.article
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 1 } }}
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      className="md:py-20 md:pt-24 lg:pt-0 lg:py-0 sm:my-10 sm:py-10"
      id="home"
    >
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="col-span-8 place-self-center text-center sm:text-left justify-self-start">
          <motion.h1
            initial={{ x: "100%" }}
            animate={{ x: -4 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-white mb-4 text-4xl sm:text-4xl md:text-5xl lg:text-7xl lg:leading-normal font-extrabold"
          >
            <motion.span
              variants={itemVariants}
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600"
            >
              Hello, I&apos;m
            </motion.span>
            <br />
            <TypeAnimation
              className="sm:w-full"
              sequence={[
                "Hendriansyah Rizky Setiawan",
                800,
                "an Android app developer",
                800,
                "a React & Next.js developer",
                800,
                "a PHP & MySQL backend builder",
                800,
                "skilled with Firebase & GCP",
                800,
                "constantly learning and creating",
                800,
              ]}
              wrapper="span"
              speed={30}
              repeat={Infinity}
            />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl text-wrap lg:mr-20 md:mr-20 md:pr-20"
          >
            I&apos;m a software developer passionate about crafting mobile applications using Kotlin, building web apps with React and PHP, and deploying cloud-powered solutions using Firebase, Google Cloud, and Azure.
          </motion.p>

          <div>
            <a
              href="https://www.linkedin.com/in/hendriansyah-rizky-setiawan-8b4a68308/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                variants={itemVariants}
                className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 hover:bg-slate-200 text-white bg-gradient-to-br from-primary-500 via-secondary-600 to-secondary-500"
              >
                Hire Me
              </motion.button>
            </a>

            <motion.button
              variants={itemVariants}
              className="px-1 py-1 w-full sm:w-fit rounded-full bg-transparent hover:bg-slate-800 text-white mt-3 bg-gradient-to-br from-primary-500 via-secondary-600 to-secondary-500"
            >
              <a
                href="/curriculum/CV Resume - Hendriansyah Rizky Setiawan - Android.pdf"
                download="CV_Resume_-_Hendriansyah_Rizky_Setiawan.pdf"
                className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2"
              >
                Download CV
              </a>
            </motion.button>
          </div>
        </div>

        <div className="col-span-4 place-self-center mt-4 lg:mt-0 md:ml-20 hidden lg:block md:block">
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: -100, opacity: 1 }}
            exit={{ opacity: 1, transition: { duration: 10 } }}
            transition={{ type: "spring", stiffness: 30 }}
            className="rounded-full w-80 h-80 lg:w-[400px] lg:h-[400px] md:w-[300px] md:h-[300px] md:block lg:block"
          >
            <Image
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-full"
              src="/images/pribadi-kartun.png"
              alt="Hero image"
              width={380}
              height={380}
            />
            <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-900 to-transparent rounded-full w-80 h-80 lg:w-[400px] lg:h-[400px] z-1 blur-lg absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default HeroSection;
