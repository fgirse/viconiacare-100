import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/src/i18n/config';
import { Navbar9 } from "@/src/components/navbar9";
import Footer from "@/src/components/layout/Footer";

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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar9 />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}

