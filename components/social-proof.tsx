"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const outcomes = [
  { metric: "#1 Worldwide", label: "Dynamics 365 customer adds at Microsoft" },
  { metric: "$3.2M", label: "Single enterprise win vs. Adobe, Salesforce & Snowflake" },
  { metric: "5,316 units", label: "Largest competitive displacement — AppFolio vs. RealPage" },
  { metric: "168% / 294%", label: "Bookings & units attainment" },
  { metric: "$831K TCV", label: "Wolters Kluwer retention turned expansion" },
  { metric: "20+ Years", label: "Of enterprise GTM & transformation instinct" },
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 17L17 7M17 7H7M17 7V17"
      />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );
}

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="social-proof" className="bg-background py-24 lg:py-32">
      <div className="px-6 sm:px-12 lg:px-24 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div ref={headerRef} className="flex items-center justify-between mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tight text-foreground">
            Built on enterprise instinct
          </h2>
          <Link
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium transition-opacity hover:opacity-80"
          >
            Work with us
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Brand accent tile */}
          <div className="relative min-h-64 overflow-hidden rounded-2xl bg-ring text-background flex flex-col justify-between p-8">
            <p className="text-sm font-medium uppercase tracking-widest text-background/70">
              Track record
            </p>
            <p className="text-2xl lg:text-3xl font-medium leading-snug tracking-tight">
              Two decades of enterprise wins, distilled into how we get you{" "}
              <span className="font-serif italic">in the door.</span>
            </p>
          </div>

          <div className="lg:col-span-3 bg-muted/50 rounded-2xl p-8 lg:p-10 flex flex-col">
            <QuoteIcon className="w-10 h-10 text-foreground/20 mb-6" />
            <blockquote className="text-2xl lg:text-3xl font-medium leading-snug text-foreground max-w-3xl">
              Get in the door faster — with sharper positioning, AI-powered intelligence, and ecosystem-aware advisory.
            </blockquote>
            <div className="mt-auto flex items-end justify-between pt-8">
              <div>
                <p className="font-semibold text-foreground">Olufemi &ldquo;Femi&rdquo; Adedeji</p>
                <p className="text-sm text-foreground/60">Founder &amp; Principal Advisor, FAxis</p>
              </div>
              <Link
                href="#contact"
                className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Proven outcomes — uniform tiles */}
          {outcomes.map((o) => (
            <div key={o.metric} className="lg:col-span-2 bg-muted/50 rounded-2xl p-8 flex flex-col">
              <p className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                {o.metric}
              </p>
              <p className="mt-3 text-foreground/60 leading-relaxed">{o.label}</p>
            </div>
          ))}

          {/* Closing statement */}
          <div className="lg:col-span-4 bg-foreground text-background rounded-2xl p-8 lg:p-12">
            <p className="text-2xl lg:text-3xl font-medium leading-snug tracking-tight max-w-4xl">
              The foundation of FAxis is simple: the question no one else has the guts to ask is
              usually the one that <span className="font-serif italic">unlocks everything.</span>
            </p>
          </div>
        </div>

        {/* Microsoft ecosystem chips */}
        <div className="mt-16 border-t border-foreground/10 pt-10">
          <p className="text-sm font-medium uppercase tracking-widest text-ring mb-6">
            Microsoft ecosystem native
          </p>
          <ul className="flex flex-wrap gap-3">
            {[
              "Azure AI Foundry",
              "Microsoft Fabric",
              "Power Platform",
              "Dynamics 365",
              "Copilot Studio",
              "Azure OpenAI",
              "Power BI",
            ].map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-foreground/15 px-5 py-2 text-sm font-medium text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* Why organizations bring in FAxis */}
        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-foreground/10 pt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-tight text-foreground">
              Why organizations bring in <span className="font-serif italic">FAxis</span>
            </h3>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Most enterprise sellers don&apos;t fail because they lack product. They fail
              because:
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {[
                "They cannot reach the right executives",
                "Discovery cycles take too long",
                "Pre-engagement research does not scale",
                "Strategic accounts remain stalled for months",
              ].map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-4 border-b border-foreground/10 pb-4 text-lg text-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ring" />
                  {reason}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xl font-medium leading-snug tracking-tight text-foreground">
              Give us the accounts your team struggles to penetrate. We help you get in the
              door faster — with sharper executive positioning, AI-powered intelligence
              workflows, and enterprise-grade GTM strategy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
