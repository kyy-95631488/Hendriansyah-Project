import React, { useState } from "react";
import { motion } from "framer-motion";

const ProjectCard = ({
  imgUrl,
  title,
  description,
  gitUrl,
  previewUrl,
  technologies,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 1.3 }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0 },
      }}
      className="flex flex-col bg-[#18191E] border-[#33353F] border-2 shadow-sm rounded-lg w-94"
      style={{ minHeight: "400px" }}
    >
      <div className="relative h-56 m-2.5 overflow-hidden rounded-md">
        <img src={imgUrl} alt="card-image" />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center">
            <h6 className="text-white text-xl font-semibold">{title}</h6>
          </div>
          <p
            className={`text-slate-400 leading-normal font-light ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            {description}
          </p>

          <button
            onClick={toggleExpand}
            className="text-blue-500 hover:text-blue-400 mt-2"
          >
            {isExpanded ? "See less" : "Read more"}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 my-3">
          {technologies &&
            technologies.map((Icon, index) => (
              <div key={index} className="group inline-flex">
                <button
                  className="rounded-full pointer-events-none border border-white p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  {Icon}
                </button>
              </div>
            ))}
        </div>

        <div className="flex flex-col space-y-2 mt-auto">
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-slate-800 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg hover:bg-slate-700"
            >
              Live Preview
            </a>
          )}
          {gitUrl && (
            <a
              href={gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md py-2 px-4 text-center text-sm text-white bg-secondary-500 transition-all shadow-md hover:shadow-lg hover:bg-slate-700"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
