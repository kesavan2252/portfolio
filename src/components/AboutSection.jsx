import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Full-Stack Developer & Tech Explorer
            </h3>

            <p className="text-muted-foreground" style={{ textAlign: "justify" }}>
  Full-stack developer with experience in building real-world web applications using React, Node.js, PostgreSQL, and Tailwind CSS. Skilled in both frontend and backend development, with a strong foundation in Java, Python, and Javascript.
</p>

<p className="text-muted-foreground" style={{ textAlign: "justify" }}>
  Enjoys turning ideas into functional products, with projects including a latecomer monitoring system and a link shortener app. Focused on writing clean, scalable code and always exploring new tools and technologies.
</p>


            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                Get In Touch
              </a>

              <a
                href="/public/docs/Kesavan_T.pdf"
                download
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg"> Web Development</h4>
                  <p className="text-muted-foreground" style={{ textAlign: "justify" }}>
                    Building responsive, dynamic web apps using React, Tailwind,
                    and backend APIs.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Frontend with UX</h4>
                  <p className="text-muted-foreground" style={{ textAlign: "justify" }}>
                    Crafting clean UI with attention to accessibility,
                    animations, and user flow.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">Real-World Projects</h4>
                  <p className="text-muted-foreground" style={{ textAlign: "justify" }}>
                    Developed and deployed full-stack projects with live
                    features and CI/CD pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
