import { useState } from "react";
import { cn } from "@/lib/utils";
import { StarBackground } from "./StarBackground";

const skills = [
  // Languages
  {
    name: "Java",
    category: "languages",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    description: "Robust OOP language for backend and Android.",
  },
  {
    name: "Python",
    category: "languages",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    description: "Versatile language for scripting, data, and backend.",
  },
  {
    name: "JavaScript",
    category: "languages",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    description: "The language of the web. Powers interactive UIs and backend with Node.js.",
  },
  // Technologies (Frontend)
  {
    name: "React.js",
    category: "technologies",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    description: "Modern UI library for building fast, interactive apps.",
  },
  {
    name: "Next.js",
    category: "technologies",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    description: "React framework for SSR and static sites.",
  },
  {
    name: "Tailwind CSS",
    category: "technologies",
    icon: "/icons/tailwindcss.svg",
    description: "Utility-first CSS framework for rapid UI development.",
  },
  {
    name: "HTML",
    category: "technologies",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    description: "The backbone of web content and structure.",
  },
  {
    name: "CSS",
    category: "technologies",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    description: "Styles the web, from layouts to animations.",
  },
  {
    name: "GSAP.js",
    category: "technologies",
    icon: "/public/icons/gsap.png",
    description: "JavaScript animation library for high-performance animations.",
  },
  // Technologies (Backend)
  {
    name: "Node.js",
    category: "technologies",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    description: "JavaScript runtime for scalable server-side apps.",
  },
  {
    name: "Express.js",
    category: "technologies",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    description: "Minimalist web framework for Node.js.",
  },
  // Database
  {
    name: "PostgreSQL",
    category: "database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    description: "Advanced open-source relational database.",
  },
  {
    name: "MongoDB",
    category: "database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    description: "NoSQL database for flexible, scalable apps.",
  },
  {
    name: "MySQL",
    category: "database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    description: "Popular open-source relational database.",
  },
  // DevOps
  {
    name: "Docker",
    category: "devops",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    description: "Containerization for consistent deployments.",
  },
  {
    name: "GitHub Actions",
    category: "devops",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/githubactions.svg",
    description: "CI/CD automation for your projects.",
  },
  {
    name: "Linux",
    category: "devops",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    description: "Open-source OS for development and deployment.",
  },
  // Tools
  {
    name: "Git",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    description: "Version control for code collaboration.",
  },
  {
    name: "GitHub",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    description: "Code hosting and collaboration platform.",
  },
  {
    name: "VS Code",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    description: "Customizable code editor.",
  },
  {
    name: "Eclipse",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg",
    description: "Classic Java IDE.",
  },
  {
    name: "JetBrains",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg",
    description: "Powerful IDEs for multiple languages.",
  },
  {
    name: "Sublime Text",
    category: "tools",
    icon: "/icons/image.png",
    description: "Lightweight, fast text editor.",
  },
  {
    name: "Google Colab",
    category: "tools",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
    description: "Cloud-based Python notebook environment.",
  },
];

const categories = [
  "all",
  "languages",
  "technologies",
  "database",
  "devops",
  "tools",
];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hovered, setHovered] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  // Track loaded state for each icon
  const [loadedIcons, setLoadedIcons] = useState(Array(skills.length).fill(false));

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  // Mouse move handler for tooltip tracking
  const handleMouseMove = (e) => {
    setMouseX(e.nativeEvent.offsetX);
  };

  // Handler for when an icon loads
  const handleIconLoad = (idx) => {
    setLoadedIcons((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  return (
    <section id="skills" className="relative py-24 px-4 overflow-hidden">
      <StarBackground className="absolute inset-0 z-0" />
      <div className="relative z-10 container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          My <span className="text-cyan-600 dark:text-cyan-300">Skills</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400",
                activeCategory === category
                  ? "bg-cyan-600 text-white dark:bg-white-300 dark:text-gray-900"
                  : "bg-transparent text-cyan-700 dark:text-cyan-200 hover:bg-white-900/10 dark:hover:bg-cyan-800/20"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredSkills.map((skill, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center relative"
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                style={{
                  background: "rgba(20, 20, 20, 0.55)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(80,80,80,0.25)",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  setHovered(idx);
                  setMouseX(e.nativeEvent.offsetX);
                }}
                onMouseMove={handleMouseMove}
                onFocus={() => setHovered(idx)}
                tabIndex={0}
                aria-describedby={hovered === idx ? `skill-desc-${idx}` : undefined}
              >
                {/* Skeleton loader */}
                {!loadedIcons[idx] && (
                  <div className="w-14 h-14 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className={cn(
                    "w-14 h-14 object-contain",
                    !loadedIcons[idx] && "hidden"
                  )}
                  onLoad={() => handleIconLoad(idx)}
                  draggable={false}
                />
              </div>
              <span className="text-gray-900 dark:text-cyan-100 text-base text-center font-medium">{skill.name}</span>
              {hovered === idx && (
                <div
                  id={`skill-desc-${idx}`}
                  className="pointer-events-none select-none absolute -top-10 left-1/2 -translate-x-1/2 w-max max-w-xs px-3 py-1 rounded bg-black/80 text-white text-xs border border-cyan-700 dark:border-cyan-300 shadow"
                  style={{
                    zIndex: 20,
                    left: `calc(50% + ${mouseX - 48}px)`, // 48 = w-24/2, centers tooltip on mouse
                  }}
                >
                  {skill.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
