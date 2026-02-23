import { Navbar9 } from "@/src/components/navbar9";
import Footer from "@/src/components/layout/Footer";

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar9 />
      {children}
      <Footer />
    </>
  );
}


