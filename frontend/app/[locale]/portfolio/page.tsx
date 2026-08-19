/**
 * Example landing page -- Personal/Portfolio style.
 *
 * A clean, minimal personal portfolio page. Forks can use this as a
 * starting point for personal websites.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import { resolveLocale } from "@/i18n/messages";
import { buildAlternates } from "@/lib/seo";
import { SectionWrapper } from "@/components/shared/sections/section-wrapper";
import { siteConfig } from "@/config/site.config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  return {
    alternates: buildAlternates(locale, "portfolio"),
    robots: { index: true, follow: true },
  };
}

const projects = [
  {
    title: "Project One",
    description: "A brief description of the project and what technologies were used.",
    image: "/images/blog/programming-setup.jpg",
    link: "#",
    tags: ["React", "TypeScript", "Tailwind"],
  },
  {
    title: "Project Two",
    description: "Another project description highlighting the impact and results.",
    image: "/images/blog/ai-brain-future.jpg",
    link: "#",
    tags: ["Next.js", "Python", "AI"],
  },
  {
    title: "Project Three",
    description: "A third project showing breadth of experience and skills.",
    image: "/images/blog/ai-robot-hands.jpg",
    link: "#",
    tags: ["Node.js", "PostgreSQL", "Docker"],
  },
];

const experience = [
  {
    role: "Senior Engineer",
    company: "Tech Company",
    period: "2022 -- Present",
    description: "Led development of core platform features serving 10M+ users.",
  },
  {
    role: "Software Engineer",
    company: "Startup Inc",
    period: "2020 -- 2022",
    description: "Built the initial product from 0 to 1. Shipped 15+ features in the first year.",
  },
  {
    role: "Junior Developer",
    company: "Agency Co",
    period: "2018 -- 2020",
    description: "Delivered client projects across e-commerce, SaaS, and media.",
  },
];

export default async function PortfolioPage() {
  return (
    <main>
      {/* Hero */}
      <SectionWrapper className="bg-background pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Hi, I'm [Your Name]
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            I build products that people love to use. Currently focused on AI-powered
            developer tools and making complex systems simple.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/blog"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Read my blog
            </Link>
            <Link
              href="#contact"
              className="text-sm font-semibold leading-6 text-foreground"
            >
              Get in touch <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Projects */}
      <SectionWrapper className="bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-16">
            Selected work
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Link
                key={index}
                href={project.link}
                className="group block overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Experience */}
      <SectionWrapper className="bg-background">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-16">
            Experience
          </h2>
          <div className="space-y-12">
            {experience.map((job, index) => (
              <div key={index} className="flex gap-8">
                <div className="flex-shrink-0 w-32 text-sm text-muted-foreground pt-1">
                  {job.period}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {job.role}
                  </h3>
                  <p className="text-primary">{job.company}</p>
                  <p className="mt-2 text-muted-foreground">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Contact */}
      <SectionWrapper className="bg-muted/50">
        <div className="mx-auto max-w-4xl text-center" id="contact">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Let's work together
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            I'm always open to interesting projects and collaborations.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Say hello
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-foreground"
            >
              GitHub <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
