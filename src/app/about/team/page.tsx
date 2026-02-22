"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const teamMembers = [
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person1.jpeg",
    title: "Joana Doe",
    designation: "Creative Director",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person2.jpeg",
    title: "John Smith",
    designation: "Lead Developer",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person3.jpeg",
    title: "Alice Johnson",
    designation: "Project Manager",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person4.jpeg",
    title: "Robert Brown",
    designation: "UX Designer",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person5.jpeg",
    title: "Emily White",
    designation: "Marketing Specialist",
  },
];

interface Gallery27Props {
  className?: string;
}

const Gallery27 = ({ className }: Gallery27Props) => {
  return (
    <section className={cn("py-32 flex flex-col items-center justify-center w-full", className)}>
      <div className="container mx-auto flex flex-col items-center text-center max-w-9xl px-4">
        <h1 className="font-calSans text-center text-6xl">Das Team Hinter dem Erfolg von ViconiaCare</h1>
        <p className="mt-3 max-w-xl text-center text-muted-foreground">
          {" "}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magnam veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliqui
        </p>
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="relative w-full pt-15"
        >
          <CarouselContent className="items-center">
            {teamMembers.map((member, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                <div className="group flex flex-col items-center text-center">
                  <Image
                    src={member.src}
                    alt={member.title}
                    width={400}
                    height={400}
                    className="h-92 w-full object-cover transition-all duration-300 group-hover:translate-y-[-10px]"
                  />
                  <h3 className="mt-4 text-2xl font-semibold">
                    {member.title}
                  </h3>
                  <p className="text-muted-foreground">{member.designation}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex justify-center gap-4">
            <CarouselPrevious variant="default" className="static translate-y-0" />
            <CarouselNext variant="default" className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Gallery27 ;
