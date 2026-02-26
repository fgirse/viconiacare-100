import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { Playfair_Display, Lato, Bowlby_One_SC } from 'next/font/google';
import { locales } from '@/src/i18n/config';
import { Navbar9 } from "@/src/components/navbar9";
import Footer from "@/src/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body',
  display: 'swap',
})

const bowlby = Bowlby_One_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bowlby',
  display: 'swap',
})

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  const messages = (await import(`@/src/i18n/locales/${locale}/common.json`)).default;

  return (
    <div className={`${playfair.variable} ${lato.variable} ${bowlby.variable} font-body bg-white text-stone-900`}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar9 />
        {children}
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}

