import Link from "next/link";

const NavLink = ({ href, title }) => {
  const scrollToSection = (event) => {
    event.preventDefault();

    console.log(`Trying to scroll to ${href}`);
    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);

    if (section) {
      console.log(`Scrolling to section ${sectionId}`);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log(`Section ${sectionId} not found`);
    }
  };

  return (
    <a
      href={href}
      onClick={scrollToSection}
      className="block py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white"
    >
      {title}
    </a>
  );
};

export default NavLink;
