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
    <header className={`w-full bg-white shadow-sm overflow-visible relative z-50 ${className}`}>
      <nav
        aria-label="Global"
        className="max-w-screen-xl px-4 sm:px-8 mx-auto flex items-center justify-between h-16"
      >
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-6 w-auto"
            style={{ marginTop: "-6px", width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-6 w-auto"
                style={{ marginTop: "-4px", width: "auto" }}
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
