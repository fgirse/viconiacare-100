"use client";

import { cn } from "@/src/lib/utils/utils";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

const teamMembers = [
  {
    src: "https://yvwrwpnbd94xpwam.public.blob.vercel-storage.com/Team/portrait1964.png",
    title: "Frank Girse",
    designation: "Creative Direktor",
  },
  {
    src: "https://yvwrwpnbd94xpwam.public.blob.vercel-storage.com/Team/portraitmick.png",
    title: "Michel Schreck",
    designation: "Gesellschafter, Pflegedienst Leitung",
  },
  {
    src: "https://yvwrwpnbd94xpwam.public.blob.vercel-storage.com/Team/LuckyLuke.png",
    title: "Conny Adam",
  designation: "Gesellschafterin, Pflegeleitung",
  },
  {
    src: "https://yvwrwpnbd94xpwam.public.blob.vercel-storage.com/Team/LuckyLuke.png",
    title: "Nieck Navard",
    designation: "Gesellschafter und Unternehmer",
  },
  {
    src: "https://yvwrwpnbd94xpwam.public.blob.vercel-storage.com/Team/LuckyLuke.png",
    title: "Britta Höppner",
    designation: " Qualitätsmanagement, Strategie und Organisation",
  },
];

interface Gallery27Props {
  className?: string;
}

const Gallery27 = ({ className }: Gallery27Props) => {
  return (
    <section className={cn("py-32 flex flex-col items-center justify-center w-full", className)}>
      <div className="container mx-auto flex flex-col items-center text-center max-w-9xl px-4">
        <h1 className="font-calSans text-center text-yellow-600 font-passionate text-6xl">Das Team Hinter dem Erfolg von ViconiaCare</h1>
        <p className="mt-3 max-w-xl text-center text-muted-foreground">
          {" "}
          ViconiaCare ist stolz darauf, ein Team von engagierten Fachleuten zu haben, die sich leidenschaftlich für die Bereitstellung von hochwertiger Pflege einsetzen. Unser Team besteht aus erfahrenen Pflegekräften, engagierten Betreuern und einem unterstützenden Verwaltungspersonal, das alle zusammenarbeitet, um sicherzustellen, dass unsere Kunden die bestmögliche Betreuung erhalten. Jeder in unserem Team bringt einzigartige Fähigkeiten und Erfahrungen mit, die es uns ermöglichen, auf die individuellen Bedürfnisse unserer Kunden einzugehen und ihnen eine liebevolle und professionelle Pflege zu bieten.  
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
