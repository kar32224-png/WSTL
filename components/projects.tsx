"use client";

import { useEffect, useRef, useState } from "react";
import { useOverlay } from "@/lib/overlay-context";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


interface Project {
  id: string;
  titleUp: string;
  titleDown: string;
  image: string;
  sub: string;
  description: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: "1",
    titleUp: "Discovery",
    titleDown: "Intelligence Brief™",
    image: "/faxis/discovery-workflow.webp",
    sub: "Executive Account Intelligence & Strategic GTM Alignment",
    description: "AI-powered executive intelligence that prepares your team for high-value discovery conversations before outreach begins — executive research, organizational intelligence, and GTM alignment.",
    tags: ["Executive priorities", "Organizational friction", "Engagement pathways"],
  },
  {
    id: "2",
    titleUp: "Discovery",
    titleDown: "Partners™",
    image: "/faxis/account-prioritization.webp",
    sub: "Embedded GTM Acceleration & Executive Access",
    description: "Hands-on partnership embedded alongside your team — pairing executive alignment with ecosystem-based prospecting to open and accelerate strategic accounts.",
    tags: ["Executive alignment", "Ecosystem co-prospecting", "Growth advisory"],
  },
  {
    id: "3",
    titleUp: "",
    titleDown: "FAxis Five™",
    image: "/faxis/discovery-workflow.webp",
    sub: "Executive Intelligence & Account Acceleration in 30 Minutes",
    description: "A fast, intensive AI-powered engagement — account intelligence, executive research, and transformation mapping, distilled into one focused sprint.",
    tags: ["Account intelligence", "Transformation mapping", "Stakeholder read"],
  },
];

function ProjectOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt={`${project.titleUp} ${project.titleDown}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
          <motion.div
            className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6 md:left-12 md:top-12 lg:left-16 lg:top-16"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[clamp(2rem,8vw,6rem)] font-medium leading-[0.95] tracking-tight text-white">
              <span className="block">{project.titleUp}</span>
              <span className="block font-serif italic">{project.titleDown}</span>
            </h2>
          </motion.div>
          <motion.div
            className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 md:right-12 md:top-12 lg:right-16 lg:top-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110 active:scale-95 md:h-14 md:w-14"
              aria-label="Close overlay"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectItem({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!containerRef.current) return;
    const title = titleRef.current, desc = descRef.current;
    gsap.set(title, { y: 60, opacity: 0 });
    gsap.set(desc, { y: 40, opacity: 0 });

    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "top 45%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    revealTl.fromTo(
      imageContainerRef.current,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, ease: "power3.out" }
    );

    const textTl = gsap.timeline({
      scrollTrigger: { trigger: containerRef.current, start: "top 50%", toggleActions: "play none none reverse" },
    });
    textTl.to(title, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .to(desc, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6");

    return () => { revealTl.kill(); textTl.kill(); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="group cursor-pointer py-16 md:py-24"
      onClick={onClick}
    >
      <div className="mx-auto max-w-360 px-6 sm:px-12 lg:px-24 2xl:max-w-450 3xl:max-w-550">
        <div className={`flex flex-col gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} md:items-center md:gap-16`}>
          <div
            ref={imageContainerRef}
            className="relative aspect-video w-full overflow-hidden rounded-2xl bg-background shadow-2xl shadow-foreground/10 md:w-3/5"
          >
            <Image
              src={project.image}
              alt={`${project.titleUp} ${project.titleDown}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain object-top"
            />
          </div>
          <div className={`flex flex-col md:w-2/5 ${isEven ? "" : "md:text-right"}`}>
            <span className="text-base font-medium uppercase tracking-widest text-muted-foreground mb-6">0{index + 1} — Offering</span>
            <h3 ref={titleRef} className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] tracking-tight text-foreground mb-5">
              {project.titleUp ? (
                <>
                  <span className="font-medium">{project.titleUp}</span><br />
                  <span className="font-serif italic">{project.titleDown}</span>
                </>
              ) : (
                <span className="font-serif italic">{project.titleDown}</span>
              )}
            </h3>
            <p className={`text-foreground text-lg font-medium mb-6 ${isEven ? "max-w-lg" : "max-w-lg md:ml-auto"}`}>
              {project.sub}
            </p>
            <p ref={descRef} className={`text-muted-foreground text-xl leading-relaxed mb-8 ${isEven ? "max-w-lg" : "max-w-lg md:ml-auto"}`}>
              {project.description}
            </p>
            <ul className={`flex flex-wrap gap-2 ${isEven ? "" : "md:justify-end"}`}>
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm font-medium text-muted-foreground">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { setIsOverlayOpen } = useOverlay();

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsOverlayOpen(true);
  };

  const handleClose = () => {
    setSelectedProject(null);
    setIsOverlayOpen(false);
  };

  return (
    <section id="projects" className="projects bg-background relative py-24">
      <ProjectOverlay project={selectedProject} onClose={handleClose} />
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectItem key={project.id} project={project} index={index} onClick={() => handleProjectClick(project)} />
        ))}
      </div>
    </section>
  );
}
