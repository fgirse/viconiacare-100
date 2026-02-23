"use client";
import { CldImage } from 'next-cloudinary';

export default function HeroImageD() {
  return (
    <CldImage
      width="153"
      height="89"
      src="/ximx1lgifouediy0mjlw"
      alt=""
      className="hidden md:block"
      suppressHydrationWarning
    />
  );
}