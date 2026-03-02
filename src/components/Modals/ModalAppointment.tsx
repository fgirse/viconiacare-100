"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import Image from "next/image";
import TerminButton from "@/public/images/buttonGruenobg.svg";
import BookingSection from "@/src/components/booking/BookingSection";

export const title = "Form with Radio Group";

const Example = () => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Image
          src={TerminButton}
          alt="Termin Button"
          width={200}
          height={200}
          className="z-50 absolute w-36 top-[80vh] right-1 cursor-pointer top-[84vh] md:w-36 md:top-[15vh] md:right-12 lg:w-54"
        />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-red-500 rounded-2xl p-0 shadow-xl overflow-hidden w-[100vw] h-[66vh] max-w-none">
        {/* sr-only title required by Radix for screen reader accessibility */}
        <AlertDialogTitle className="hidden">Terminbuchung</AlertDialogTitle>
          <div className="  ">
              <BookingSection />
          </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Example;
