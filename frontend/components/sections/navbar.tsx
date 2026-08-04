"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export interface NavLink {
  label: string;
  href: string;
  variant?: "default" | "primary";
}

export interface NavbarProps {
  links: NavLink[];
  logo: { src: string; alt: string; width: number; height: number };
  className?: string;
}

export function Navbar({ links, logo, className = "" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm ${className}`}>
      <nav aria-label="Global" className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) =>
            link.variant === "primary" ? (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
        >
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-foreground"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="space-y-2">
              {links.map((link) =>
                link.variant === "primary" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
