"use client";

import {
  Bell,
  Book,
  Brain,
  Castle,
  ChevronRight,
  CrossIcon,
  Globe,
  Grid,
  HelpCircle,
  Info,
  LucideIcon,
  Menu,
  Umbrella,
  User,
  X,
} from "lucide-react";
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
  icon?: {
    component: LucideIcon;
    color: string;
    size?: number;
  };
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
          icon: { component: Castle, color: "#f0d10b" },
        },
        {
          label: t("leitbild"),
          description: t("leitbild_desc"),
          url: "/about/leitbild",
          icon: { component: Grid, color: "#f0d10b" },
        },
        {
          label: t("team"),
          description: t("team_desc"),
          url: "/about/team",
          icon: { component: User, color: "#f0d10b" },
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
          icon: { component: Info, color: "#f0d10b", size: 36},
        },
        {
          label: t("behandlung_title"),
          description: t("behandlung_desc"),
          url: "/behandlung",
          icon: { component: HelpCircle, color: "#f0d10b", size: 24 },
        },
        {
          label: t("hauswirtschaft_title"),
          description: t("hauswirtschaft_desc"),
          url: "/hauswirtschaft",
          icon: { component: Bell, color: "#f0d10b", size: 24 },
        },
        {
          label: t("begleitung_title"),
          description: t("begleitung_desc"),
          url: "/begleitung",
          icon: { component: Umbrella, color: "#f0d10b", size: 24 },
        },
        {
          label: t("demenz_title"),
          description: t("demenz_desc"),
          url: "/demenz",
          icon: { component: Brain, color: "#f0d10b", size: 24 },
        },
        {
          label: t("palliativ_title"),
          description: t("palliativ_desc"),
          url: "/palliativ",
          icon: { component: CrossIcon, color: "#f0d10b", size: 24 },
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
          icon: { component: Book, color: "#f0d10b" },
        },
        {
          label: t("api"),
          description: t("api_desc"),
          url: "#",
          icon: { component: Globe, color: "#f0d10b" },
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
          "dark pointer-events-auto relative z-999 bg-gradient-to-r from-stone-800 via-stone-600 to-stone-900 backdrop-blur-lg transition-colors duration-300 lg:bg-",
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
              <Button variant="outline" asChild className="hidden lg:flex border-white text-yellow-400 bg-red-400 hover:bg-yellow-500/50">
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
            "h-fit bg-yellow-600 font-black uppercase hover:bg-yellow-700 text-foreground focus:!bg-green-600",
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
          <link.icon.component
            size={link.icon.size ?? 20}
            style={{ stroke: link.icon.color }}
          />
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
        isActive ? "text-yellow-400" : "text-muted-foreground",
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
