"use client";

import React from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/src/lib/utils/utils";
import Image from "next/image";
import { Link, usePathname } from "@/src/i18n/navigation";
import LogoText from "@/src/components/Cloudinary/HeroImageD";
import LogoViconiaCare from "@/public/images/ViconiaCareLogoobg.svg";

type AppPathname = string;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle } from "@/src/components/ui/sheet";

interface MenuLink {
  label: string;
  description?: string;
  url?: string;
  icon?: React.ReactNode;
}
interface MenuItem {
  title: string;
  url?: string;
  links?: MenuLink[];
}

interface DesktopMenuItemProps {
  item: MenuItem;
  index: number;
}

interface MobileNavigationMenuProps {
  open: boolean;
  navigation: MenuItem[];
  primaryButton: { label: string; url: string };
}

interface MenuSubLinkProps {
  link: MenuLink;
}

// ── Duotone SVG icons (yellow-600 / white) ──────────────────────────────────
function IconCastle() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="12" rx="1" fill="#ca8a04" fillOpacity="0.15" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="4"  y="7" width="3" height="4" rx="0.5" fill="#ca8a04" />
      <rect x="9"  y="7" width="3" height="4" rx="0.5" fill="#ca8a04" />
      <rect x="14" y="7" width="3" height="4" rx="0.5" fill="#ca8a04" />
      <path d="M10 22v-5a2 2 0 014 0v5" fill="white" fillOpacity="0.8" stroke="#ca8a04" strokeWidth="1.2" />
      <rect x="6"  y="13" width="3" height="3" rx="0.5" fill="#ca8a04" fillOpacity="0.5" />
      <rect x="15" y="13" width="3" height="3" rx="0.5" fill="#ca8a04" fillOpacity="0.5" />
    </svg>
  )
}

function IconLeitbild() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 6v6c0 4.4 3.4 8.5 8 9.5C17.6 20.5 21 16.4 21 12V6L12 2z" fill="#ca8a04" fillOpacity="0.15" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7l1.2 3.6H16.8l-2.9 2.1 1.1 3.4L12 14l-3 2.1 1.1-3.4L7.2 10.6H10.8z" fill="#ca8a04" />
      <circle cx="12" cy="13.5" r="1.2" fill="white" />
    </svg>
  )
}

function IconTeam() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="15" cy="6.5" r="2.8" fill="#ca8a04" fillOpacity="0.3" />
      <path d="M10.5 21c0-3.2 2-5.8 4.5-5.8S19.5 17.8 19.5 21" stroke="#ca8a04" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.35" />
      <circle cx="9.5" cy="6.5" r="3.2" fill="#ca8a04" />
      <circle cx="9.5" cy="6.5" r="1.3" fill="white" />
      <path d="M4 21c0-3.5 2.5-6.2 5.5-6.2S15 17.5 15 21" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function IconCare() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="16" height="12" rx="2" fill="#ca8a04" fillOpacity="0.13" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="9" y="5" width="6" height="6" rx="3" fill="#ca8a04" />
      <circle cx="12" cy="8" r="1.5" fill="white" />
      <line x1="12" y1="12" x2="12" y2="17" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
      <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconMedical() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="#ca8a04" fillOpacity="0.13" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="10" y="7" width="4" height="10" rx="1.2" fill="#ca8a04" />
      <rect x="7" y="10" width="10" height="4" rx="1.2" fill="#ca8a04" />
      <rect x="10.8" y="10.8" width="2.4" height="2.4" rx="0.6" fill="white" />
    </svg>
  )
}

function IconHouse() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12l9-8 9 8v9a1 1 0 01-1 1H4a1 1 0 01-1-1z" fill="#ca8a04" fillOpacity="0.15" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 21v-7h6v7" stroke="#ca8a04" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <rect x="6" y="13" width="3" height="3" rx="0.5" fill="#ca8a04" fillOpacity="0.55" />
      <rect x="14.5" y="4" width="2" height="4" rx="0.4" fill="#ca8a04" />
    </svg>
  )
}

function IconUmbrella() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12A9 9 0 0121 12H3z" fill="#ca8a04" fillOpacity="0.2" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12v7a2 2 0 01-4 0" stroke="#ca8a04" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <line x1="12" y1="3.5" x2="12" y2="12" stroke="#ca8a04" strokeWidth="1.3" />
      <line x1="6" y1="7" x2="12" y2="12" stroke="#ca8a04" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="18" y1="7" x2="12" y2="12" stroke="#ca8a04" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="3.5" y1="10.5" x2="12" y2="12" stroke="#ca8a04" strokeWidth="1" strokeOpacity="0.35" />
      <line x1="20.5" y1="10.5" x2="12" y2="12" stroke="#ca8a04" strokeWidth="1" strokeOpacity="0.35" />
    </svg>
  )
}

function IconBrain() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5c0 0-4 1-5 4.5-.7 2.3 0 4.5 1.5 5.5l2 1.5V21" fill="#ca8a04" fillOpacity="0.18" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5c0 0 4 1 5 4.5.7 2.3 0 4.5-1.5 5.5l-2 1.5V21" fill="#ca8a04" fillOpacity="0.3" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="5" x2="12" y2="21" stroke="#ca8a04" strokeWidth="1.3" strokeDasharray="2 1.5" />
      <path d="M8.5 9.5c.8.6 1 1.6.5 2.4" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M15.5 9.5c-.8.6-1 1.6-.5 2.4" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function IconPalliativ() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="#ca8a04" fillOpacity="0.12" stroke="#ca8a04" strokeWidth="1.5" />
      <path d="M12 7c0 0-5 3-5 7 0 2.2 2.2 4 5 4s5-1.8 5-4c0-4-5-7-5-7z" fill="#ca8a04" fillOpacity="0.5" stroke="#ca8a04" strokeWidth="1.3" />
      <line x1="12" y1="8.5" x2="12" y2="17.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="11.5" x2="9.5" y2="13" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <line x1="12" y1="13.5" x2="14.5" y2="15" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="11" height="17" rx="1.5" fill="#ca8a04" fillOpacity="0.2" stroke="#ca8a04" strokeWidth="1.4" />
      <rect x="5" y="4" width="11" height="16" rx="1.5" fill="#ca8a04" fillOpacity="0.13" stroke="#ca8a04" strokeWidth="1.5" />
      <line x1="5" y1="4" x2="5" y2="20" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="9"    x2="13" y2="9"    stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="11.5" x2="13" y2="11.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="14"   x2="11" y2="14"   stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconGlobeNav() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="#ca8a04" fillOpacity="0.12" stroke="#ca8a04" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#ca8a04" strokeWidth="1.4" fill="none" />
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#ca8a04" strokeWidth="1.3" />
      <path d="M4.5 8c2 1 4 1.5 7.5 1.5S19.5 9 19.5 8" stroke="#ca8a04" strokeWidth="1.1" fill="none" />
      <path d="M4.5 16c2-1 4-1.5 7.5-1.5S19.5 15 19.5 16" stroke="#ca8a04" strokeWidth="1.1" fill="none" />
    </svg>
  )
}

const LOGO = {
  url: "/",
  src: LogoViconiaCare,
  alt: "logo",
  title: "ViconiaCare GmbH",
};

const MOBILE_BREAKPOINT = 1024;

interface Navbar9Props {
  className?: string;
}

const Navbar9 = ({ className }: Navbar9Props) => {
  const t = useTranslations("nav");

  const navigation: MenuItem[] = [
    { title: t("home"), url: "/" },
    {
      title: t("about"),
      links: [
        {
          label: t("history"),
          description: t("history_desc"),
          url: "/about/history",
          icon: <IconCastle />,
        },
        {
          label: t("leitbild"),
          description: t("leitbild_desc"),
          url: "/about/leitbild",
          icon: <IconLeitbild />,
        },
        {
          label: t("team"),
          description: t("team_desc"),
          url: "/about/team",
          icon: <IconTeam />,
        },
      ],
    },
    {
      title: t("services"),
      links: [
        {
          label: t("grundpflege_title"),
          description: t("grundpflege_desc"),
          url: "/grundpflege",
          icon: <IconCare />,
        },
        {
          label: t("behandlung_title"),
          description: t("behandlung_desc"),
          url: "/behandlung",
          icon: <IconMedical />,
        },
        {
          label: t("hauswirtschaft_title"),
          description: t("hauswirtschaft_desc"),
          url: "/hauswirtschaft",
          icon: <IconHouse />,
        },
        {
          label: t("begleitung_title"),
          description: t("begleitung_desc"),
          url: "/begleitung",
          icon: <IconUmbrella />,
        },
        {
          label: t("demenz_title"),
          description: t("demenz_desc"),
          url: "/demenz",
          icon: <IconBrain />,
        },
        {
          label: t("palliativ_title"),
          description: t("palliativ_desc"),
          url: "/palliativ",
          icon: <IconPalliativ />,
        },
      ],
    },
    {
      title: t("resources"),
      links: [
        {
          label: t("docs"),
          description: t("docs_desc"),
          url: "#",
          icon: <IconBook />,
        },
        {
          label: t("api"),
          description: t("api_desc"),
          url: "#",
          icon: <IconGlobeNav />,
        },
      ],
    },
    { title: t("menu4"), url: "/menu_4" },
    { title: t("contact"), url: "/contact" },
  ];

  const primaryButton = { label: t("login"), url: "/login" };

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleMobileMenu = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
  };

  return (
    <Fragment>
      <section
        className={cn(
          "dark pointer-events-auto relative z-999 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 backdrop-blur-lg transition-colors duration-300 lg:bg-",
          className,
        )}
      >
        <div className="container h-16">
          <div className="ml-12 flex h-full items-center justify-between">
            <Link
              href="/"
              className="flex max-h-8 items-center gap-2 text-lg font-semibold tracking-tighter"
            >
              <Image
                src={LOGO.src}
                alt={LOGO.alt}
                width={200}
                height={200}
                className="inline-block size-12 object-contain"
              />
              <LogoText/>
              {/*<span className="hidden text-foreground md:inline-block">
                {LOGO.title}
              </span>*/}
            </Link>
            <NavigationMenu className="hidden lg:flex" viewport={false}>
              <NavigationMenuList className="uppercase lg:text-2xl">
                {navigation.map((item, index) => (
                  <DesktopMenuItem
                    key={`desktop-link-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild className="hidden lg:flex border-black text-stone-100 !bg-stone-600 hover:!bg-yellow-500">
                <Link href="/termin">{t("booking")}</Link>
              </Button>
              <Button asChild>
                <a href={primaryButton.url}>{primaryButton.label}</a>
              </Button>
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={handleMobileMenu}>
                  {open ? (
                    <X className="size-5.5 stroke-foreground" />
                  ) : (
                    <Menu className="size-5.5 stroke-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MobileNavigationMenu open={open} navigation={navigation} primaryButton={primaryButton} />
    </Fragment>
  );
};

const DesktopMenuItem = ({ item, index }: DesktopMenuItemProps) => {
  const pathname = usePathname();
  const isActive = item.url
    ? item.url === pathname
    : item.links?.some((l) => l.url === pathname) ?? false;

  if (item.links) {
    return (
      <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
        <NavigationMenuTrigger
          className={cn(
            "h-fit bg-yellow-600 font-black uppercase hover:bg-yellow-700 text-foreground focus:!bg-teal-700/30",
            isActive && "!bg-yellow-700 underline underline-offset-4",
          )}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="!rounded-xl !p-0">
          <ul className="w-[20rem] p-2.5">
            {item.links.map((link, index) => (
              <li key={`desktop-nav-sublink-${index}`}>
                <MenuSubLink link={link} />
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={`desktop-menu-item-${index}`} value={`${index}`}>
      <NavigationMenuLink
        asChild
        className={cn(
          navigationMenuTriggerStyle(),
          "h-fit bg-yellow-600 font-black hover:bg-yellow-700 text-foreground",
          isActive && "!bg-yellow-700 underline underline-offset-4",
        )}
      >
        <Link href={(item.url ?? "/") as AppPathname}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const MenuSubLink = ({ link }: MenuSubLinkProps) => {
  const isPath = link.url?.startsWith("/") ?? false;

  const inner = (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-2.5">
        {link.icon && (
          <span className="flex-shrink-0">{link.icon}</span>
        )}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm leading-none text-foreground">{link.label}</h3>
          <p className="text-sm leading-[1.2] text-muted-foreground/80">
            {link.description}
          </p>
        </div>
      </div>
      <ChevronRight className="size-3.5 stroke-muted-foreground opacity-100" />
    </div>
  );

  if (isPath) {
    return (
      // @ts-expect-error – url is a valid AppPathname when isPath is true
      <Link href={link.url} className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted">
        {inner}
      </Link>
    );
  }

  return (
    <a
      href="#"
      aria-disabled="true"
      className="flex items-center gap-4 rounded-lg p-2 opacity-40 cursor-not-allowed pointer-events-none"
    >
      {inner}
    </a>
  );
};

const MobileNavItem = ({ item, index }: { item: MenuItem; index: number }) => {
  const pathname = usePathname();
  const isActive = item.url
    ? item.url === pathname
    : item.links?.some((l) => l.url === pathname) ?? false;

  if (item.links) {
    return (
      <AccordionItem value={`nav-${index}`}>
        <AccordionTrigger
          className={cn(
            "h-[3.75rem] items-center hover:bg-yellow-700 p-5 uppercase text-xl leading-[3.75] font-black",
            isActive ? "text-yellow-400" : "text-muted-foreground",
          )}
        >
          {item.title}
        </AccordionTrigger>
        <AccordionContent>
          {item.links.map((subItem) => (
            <MenuSubLink key={subItem.label} link={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      href={(item.url ?? "/") as AppPathname}
      className={cn(
        "flex h-[3.75rem] items-center border-b p-5 uppercase hover:bg-yellow-700 text-left text-xl leading-[3.75] font-black ring-ring/10 outline-ring/50 transition-all focus-visible:ring-4 focus-visible:outline-1 nth-last-1:border-0",
        isActive ? "text-red-600" : "text-muted-foreground",
      )}
    >
      {item.title}
    </Link>
  );
};

const MobileNavigationMenu = ({ open, navigation, primaryButton }: MobileNavigationMenuProps) => {
  return (
    <Sheet open={open}>
      <SheetContent
        aria-describedby={undefined}
        side="top"
        className="dark inset-0 z-998 h-dvh w-full bg-background pt-16 [&>button]:hidden"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="container pb-12">
            <div className="absolute -m-px h-px w-px overflow-hidden border-0 mask-clip-border p-0 text-nowrap whitespace-nowrap">
              <SheetTitle className="text-primary">
                Mobile Navigation
              </SheetTitle>
            </div>
            <div className="flex h-full flex-col justify-between gap-20">
              <Accordion type="multiple" className="w-full">
                {navigation.map((item, index) => (
                  <MobileNavItem key={`mobile-${index}`} item={item} index={index} />
                ))}
              </Accordion>
              <div className="pb-20">
                <Button asChild className="w-full">
                  <a href={primaryButton.url}>{primaryButton.label}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { Navbar9 };
