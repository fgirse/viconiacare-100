import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NavItem {
  name: string;
  href: string;
}

interface SocialItem {
  name: string;
  href: string;
}

interface Footer50Props {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  navigation?: NavItem[];
  social?: SocialItem[];
  legal?: NavItem[];
  brandName?: string;
  className?: string;
}

const Footer50 = ({
  heading = "ViconiaCare - Pflege anders denken",
  description = "Der etwas andere Ansatz in der Pflege. Menschlich, modern und fair. Erfahren Sie mehr über unsere Mission und Werte.",
  ctaText = "Mehr Erfahren",
  ctaHref = "",
  navigation = [
    { name: "Product", href: "#" },
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ],
  social = [
    { name: "Twitter", href: "#" },
    { name: "LinkedIn", href: "#" },
  ],
  legal = [{ name: "Privacy Policy", href: "/privacy" }],
  className,
}: Footer50Props) => {
  return (
    <footer
      className={cn("flex flex-col items-center gap-14 pt-28 lg:pt-32", className)}
    >
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          {heading}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          {description}
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-primary mt-10 w-full md:mt-14 lg:mt-20 flex flex-col items-center">
        <Image src="/text1.png" alt="Brand Logo" width={1450} height={550} className="mx-auto" />
      </div>
    </footer>
  );
};

export default Footer50;
