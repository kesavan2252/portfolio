import { ArrowRight, ExternalLink, Github } from "lucide-react";

/* Map each tech tag to its CDN-hosted logo */
const tagIcons = {
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Node.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  Express:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "Socket.io":
    "https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg",
  Docker:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "Tailwind CSS": "/tailwind.svg",
  "CoinGecko API": "/coingecko.svg",
  "Spring Boot":
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  MySQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  JPA: "https://spring.io/img/projects/spring-data.svg",
  Swagger: "/swagger.svg",
  PostgreSQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  Supabase:
    "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png",
  JWT:
    "https://jwt.io/img/pic_logo.svg",
  Vercel:
    "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
  "Rapid API":
    "https://rapidapi.com/static-assets/rapidapi-logo.svg",
};

const projects = [
  {
    id: 1,
    title: "Link Shortener",
    description:
      "A responsive URL shortener app with analytics. Built with React.js and Rapid API, it allows users to generate, manage, and analyze short links with a clean, intuitive interface.",
    image: "/projects/linkshortener.png",
    tags: ["React.js", "Tailwind CSS", "Rapid API", "Vercel"],
    demoUrl: "https://linkshortener-seven.vercel.app/",
    githubUrl: "https://github.com/kesavan2252/linkshortener.git",
    date: "Sep 2024",
  },
  {
    id: 2,
    title: "Automation for Latecomer Monitoring System",
    description:
      "A full-stack web app to digitise and automate late arrival tracking for institutions. Features barcode scanning (ZXing, Luhn validation), secure student identification, and separate Scanner/Admin interfaces with CRUD, CSV import/export, and reporting.",
    image: "/projects/lms.png",
    tags: ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "Supabase", "Vercel"],
    demoUrl: "https://automation-for-latecomer-management-system-server.vercel.app/",
    githubUrl: "https://github.com/kesavan2252/Automation_for_latecomer_management_system",
    date: "Nov 2024 - Apr 2025",
  },
  {
    id: 3,
    title: "PBR Battery Shipment Control",
    description:
      "A full-stack platform for managing battery contracts and shipments with real-time monitoring, secure authentication, and robust admin tools. Built with React, Node.js, PostgreSQL, and JWT.",
    image: "/projects/pbr-battery.png",
    tags: ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "Supabase", "Vercel", "JWT", "Express"],
    demoUrl: "https://pbr-battery-shipment-control.vercel.app/login",
    githubUrl: "https://github.com/kesavan2252/pbr-battery-shipment-control.git",
    date: "Jun 2025",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl overflow-hidden shadow-lg border border-gray-700/40 dark:border-gray-200/10 flex flex-col"
              style={{
                background: "rgba(10, 10, 10, 0.45)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              {/* Project image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Project details */}
              <div className="flex flex-col flex-1 p-6">
                {/* Tags with logos */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium border border-cyan-700/40 dark:border-cyan-300/30 rounded-full bg-black/40 dark:bg-white/10 text-cyan-100 flex items-center gap-1"
                    >
                      {tagIcons[tag] && (
                        <img
                          src={tagIcons[tag]}
                          alt={tag}
                          className="inline-block w-4 h-4 mr-1"
                        />
                      )}
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1 text-white">{project.title}</h3>
                <p className="text-cyan-100 text-sm mb-4 min-h-[64px]">
                  {project.description}
                </p>

                {/* Spacer to push date/links to bottom */}
                <div className="flex-1" />

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-cyan-900/30">
                  <span className="text-xs text-cyan-300 font-mono">{project.date}</span>
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-200 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-200 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/kesavan2252"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
