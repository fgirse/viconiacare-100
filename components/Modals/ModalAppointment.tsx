"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
//import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TerminButton from "@/public/buttonGruenobg.svg";

export const title = "Form with Radio Group";

const routeMap: Record<string, string> = {
  phone: "/phone",
  interview: "/interview",
  homevisit: "/homevisit",
};

const Example = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("phone");

  const handleConfirm = () => {
    const route = routeMap[selected];
    if (route) router.push(route);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
    
          <Image src={TerminButton} alt="Termin Button" width={200} height={200} className="absolute w-44 top-[75vh] right-1  cursor-pointer absolute top-60 md:w-36 md:top-24 md:right-12 lg:w-54" />
    
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wählen Sie eine Terminkategorie aus!</AlertDialogTitle>
          <AlertDialogDescription>
            Wählen Sie die Kategorie aus, die am besten zu Ihrem Anliegen passt, damit wir Ihnen den passenden Termin anbieten können.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <RadioGroup value={selected} onValueChange={setSelected}>
            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent">
              <RadioGroupItem id="phone" value="phone" />
              <Label className="flex-1 cursor-pointer" htmlFor="phone">
                <div className="font-medium">INFO Telefonat</div>
                <div className="text-xs text-muted-foreground">
                  Erste Informationen und Folgetermine vereinbaren
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent">
              <RadioGroupItem id="interview" value="interview" />
              <Label className="flex-1 cursor-pointer" htmlFor="interview">
                <div className="font-medium">Evaluationsgespräch</div>
                <div className="text-xs text-muted-foreground">
                  Evaluation zur Bedarfsermittlung
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent">
              <RadioGroupItem id="homevisit" value="homevisit" />
              <Label className="flex-1 cursor-pointer" htmlFor="homevisit">
                <div className="font-medium">Hausbesuch</div>
                <div className="text-xs text-muted-foreground">
                  individuelle Beratung vor Ort
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction className="bg-yellow-600 hover:bg-yellow-700" onClick={handleConfirm}>Termin anfordern</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Example;
