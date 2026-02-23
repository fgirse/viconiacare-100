"use client";

import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { cn } from "@/src/lib/utils/utils";

import { Button } from "@/src/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";

interface Hero226Props {
  className?: string;
}

const Hero226 = ({ className }: Hero226Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const Images = [
    {
      image: "/hero3.png",
      title: "ViconiaCare",
      description: "Pflege anders denken.",
      link: "#",
    },
    {
      image: "/Graffity.svg",
      title: "ViconiaCare",
      description: "Pflege menschlich modern & fair.",
      link: "#",
    },
    {
      image: "/text1.png",
      title: "ViconiaCare",
      description: "Nachhaltig und umweltbewusst.",
      link: "#",
    },
    {
      image: "/hero4.png",
      title: "ViconiaCare",
      description: "Individuelle Lösungen für Ihre einzigartigen Bedürfnisse",
      link: "#",
    },
    {
      image: "/houseofcare.svg",
      title: "ViconiaCare",
      description: "Pflege verbindet mit Herz & Vielfalt.",
      link: "#",
    },
  ];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className={cn("py-32", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            loop: true,
            slidesToScroll: 1,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
        >
          <CarouselContent className="flex w-full gap-4">
            {Images.map((img, index) => (
              <CarouselItem key={index} className="w-full basis-[91%]">
                <div className="p-1">
                  <div
                    key={index}
                    className="relative flex h-166 flex-col items-end justify-between bg-muted p-8"
                  >
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                      <Image
                        src={img.image}
                        alt={img.title}
                        fill
                        className="object-cover"
                        sizes="91vw"
                      />
                    </div>
                    <div className="z-10 mt-42 text-white">
                      <h1 className="max-w-lg text-right text-6xl font-medium tracking-tight">
                        {img.title}
                      </h1>
                      <p className="my-6 max-w-lg text-right text-lg">
                        {img.description}
                      </p>
                    </div>
                    <div className="bg-muted00 z-10 flex w-full justify-between">
                      <a href={img.link}>
                        <Button
                          variant="outline"
                          className="text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
                        >
                          Try it for free
                          <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  current === index
                    ? "w-4 bg-primary"
                    : "bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </motion.div>
    </section>
  );
};

export { Hero226 };

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};
