"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      const items = bodyRef.current?.children;
      if (items) {
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: bodyRef.current,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="founder" className="bg-background py-24 lg:py-32">
      <div className="px-6 sm:px-12 lg:px-24 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="mb-14 flex flex-col gap-4 border-b border-foreground/10 pb-10 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-foreground max-w-2xl">
            Meet the <span className="font-serif italic">founder</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md lg:text-right">
            Two decades of enterprise instinct, distilled into an intelligence-led practice.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Image card */}
          <div ref={imageRef} className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-muted">
              <div className="relative aspect-4/5 w-full">
                <Image
                  src="/faxis/founder.webp"
                  alt="Olufemi 'Femi' Adedeji, Founder of FAxis Advisory Group"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-8">
                <div>
                  <p className="text-2xl font-medium tracking-tight text-white lg:text-3xl">
                    Olufemi Adedeji
                  </p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/70">
                    Founder &amp; Principal Advisor
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="flex flex-col lg:col-span-7 lg:pt-4">
            <span className="text-sm font-medium uppercase tracking-widest text-ring mb-8">
              FAxis Advisory Group
            </span>

            <blockquote className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-foreground mb-12">
              &ldquo;The hardest part of enterprise selling isn&apos;t the pitch — it&apos;s{" "}
              <span className="font-serif italic">getting in the door.</span> FAxis exists to
              make that part faster, sharper, and repeatable.&rdquo;
            </blockquote>

            <div className="space-y-6 max-w-2xl border-t border-foreground/10 pt-10">
              <p className="text-muted-foreground text-lg leading-relaxed lg:text-xl">
                Femi has spent two decades helping organizations win complex, high-stakes
                enterprise accounts across the Microsoft ecosystem and beyond — bridging
                executive strategy, GTM execution, and transformation leadership.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed lg:text-xl">
                He founded FAxis to turn hard-won enterprise instinct into an AI-powered,
                intelligence-led practice — so more teams reach the right buying centers with
                the right message, before the competition does.
              </p>
            </div>

            <Link
              href="#contact"
              className="mt-12 inline-flex w-fit items-center justify-center px-7 py-3.5 rounded-full bg-foreground text-background text-lg tracking-tight font-medium transition-opacity hover:opacity-80"
            >
              Work with Femi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
