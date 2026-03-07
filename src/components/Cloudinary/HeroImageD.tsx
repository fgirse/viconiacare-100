"use client";
import dynamic from 'next/dynamic';

// CldImage generates Cloudinary transformation URLs that differ between
// server and client renders → load with ssr:false to prevent hydration mismatch.
const CldImage = dynamic(
  () => import('next-cloudinary').then((m) => m.CldImage),
  { ssr: false }
);

export default function HeroImageD() {
  return (
    <CldImage
      width="153"
      height="89"
      src="/ximx1lgifouediy0mjlw"
      alt="vivonia care"
      className="hidden md:block"
    />
  );
}