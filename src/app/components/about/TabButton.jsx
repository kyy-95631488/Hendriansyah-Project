import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const TabButton = ({ active, selectTab, children }) => {
  const buttonClasses = active
    ? "text-white border-b border-secondary-500"
    : "text-[#ADB7BE]";
  return (
    <button onClick={selectTab}>
      <motion.p
        variants={itemVariants}
        initial="initial"
        whileInView="animate"
        viewport={{
          once: true,
        }}
        transition={{
          rotate: { duration: 1 },
          scale: { duration: 0.6 },
        }}
        className={`mr-3 font-semibold hover:text-white ${buttonClasses}`}
      >
        {children}
      </motion.p>
    </button>
  );
};

export default TabButton;
