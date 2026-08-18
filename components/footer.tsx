"use client";

import Link from "next/link";
import { useState } from "react";

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@faxisavg.com" },
];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Work", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const footerLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = `${form.firstName} ${form.lastName}`.trim();
    const subject = encodeURIComponent(`FAxis enquiry from ${name || "the website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:hello@faxisavg.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <section id="contact" className="bg-background text-foreground border-t border-foreground/10">
        <div className="px-6 sm:px-12 lg:px-24 py-24 lg:py-32 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-tight">
                Let&apos;s get you <span className="font-serif italic">in the door.</span>
              </h2>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md">
                Tell us about the accounts your team struggles to penetrate. We&apos;ll show you
                how FAxis accelerates access to the right buying centers.
              </p>
              <a
                href="mailto:hello@faxisavg.com"
                className="mt-8 inline-block text-xl font-medium tracking-tight hover:opacity-70 transition-opacity"
              >
                hello@faxisavg.com
              </a>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2 text-left">
                  <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="rounded-xl border border-foreground/15 bg-muted/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                    placeholder="Jane"
                  />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="rounded-xl border border-foreground/15 bg-muted/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
                <div className="flex flex-col gap-2 text-left sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-xl border border-foreground/15 bg-muted/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                    placeholder="jane@company.com"
                  />
                </div>
                <div className="flex flex-col gap-2 text-left sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="resize-y rounded-xl border border-foreground/15 bg-muted/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                    placeholder="Tell us about the accounts you're trying to reach…"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="lg:sticky lg:bottom-0 lg:z-0 bg-foreground text-background">
        <div className="px-6 sm:px-12 lg:px-24 pt-24 lg:pt-32 pb-16 lg:pb-24 text-center sm:text-left max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
          <a
            href="mailto:hello@faxisavg.com"
            className="text-2xl sm:text-5xl lg:text-7xl font-medium tracking-tight hover:opacity-80 transition-opacity break-all sm:break-normal"
          >
            hello@faxisavg.com
          </a>

          <div className="mt-10">
            <Link
              href="mailto:hello@faxisavg.com"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full bg-background text-foreground hover:bg-background/90 transition-colors"
            >
              Book a FAxis Five™
            </Link>
          </div>
        </div>

      <div className="px-6 sm:px-12 lg:px-24 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="border-t border-background/10" />
      </div>

      <div className="px-6 sm:px-12 lg:px-24 py-16 lg:py-24 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          <div>
            <span className="text-4xl font-medium tracking-tight">FAxis</span>
            <p className="mt-4 text-background/60 text-4xl">Get in the door, faster.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-16 lg:gap-24">
            <div>
            <h4 className="text-sm font-medium text-background/60 mb-6">Location</h4>
            <div className="mb-6">
              <p className="font-medium mb-1">Worldwide</p>
              <p className="text-background/60 text-sm">Serving clients globally</p>
            </div>
            <div>
              <p className="font-medium mb-1">Microsoft Ecosystem</p>
              <p className="text-background/60 text-sm">
                Partners &amp; ISVs<br />
                Enterprise GTM
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-background/60 mb-6">Services</h4>
            <ul className="space-y-3">
              <li><span className="text-background">Discovery Intelligence</span></li>
              <li><span className="text-background">Account Acceleration</span></li>
              <li><span className="text-background">Ecosystem GTM Advisory</span></li>
              <li><span className="text-background">Transformation Readiness</span></li>
              <li><span className="text-background">FAxis Five™</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-background/60 mb-6">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background hover:text-background/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-background/60 mb-6">Social</h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background hover:text-background/60 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-12 lg:px-24 py-6 max-w-360 2xl:max-w-450 3xl:max-w-550 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-sm text-background/40">
            © 2026 FAxis Advisory Group — All rights reserved
          </p>

          <p className="text-sm text-background/40">
            Get in the door, faster.
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
