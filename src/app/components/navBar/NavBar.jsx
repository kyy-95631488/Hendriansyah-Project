import React, { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import { motion } from "framer-motion";

const navLinks = [
  { title: "About", path: "#about" },
  { title: "Projects", path: "#projects" },
  { title: "Contact", path: "#contact" },
];

const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed mx-auto border-b-2 border-slate-700 top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100 w-full"
    >
      <div className="flex container lg:py-2 flex-wrap items-center justify-between mx-auto px-4 py-1">
        <Link
          href={"/"}
          className="text-2xl md:text-1xl sm:text-1xl font-semibold text-white"
        >
          <motion.span
            variants={itemVariants}
            className="hover:border-4 transition-all ease-in-out delay-150 hover:border-dashed hover:border-blue-700"
          >
            <span className="text-blue-600">{"<"}</span> Hendriansyah
            <span className="text-blue-600">{" />"}</span>
          </motion.span>
        </Link>

        {/* Botão mobile - aparece apenas em telas menores */}
        <div className="block md:hidden">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Menu padrão - aparece apenas em telas lebih besar */}
        <motion.div
          variants={itemVariants}
          className="hidden md:block"
          id="navbar"
        >
          <ul className="flex p-2 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div className="md:hidden">
          <MenuOverlay
            links={navLinks}
            closeOverlay={() => setNavbarOpen(false)}
          />
        </div>
      )}
    </motion.nav>
  );
};

export default NavBar;
