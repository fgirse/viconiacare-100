import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import '@/src/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: {
    default: 'Vivonia Care – Ambulanter Pflegedienst',
    template: '%s | Vivonia Care',
  },
  description:
    'Professionelle ambulante Pflege bei Ihnen zu Hause. Jetzt kostenloses Erstgespräch buchen.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: ['ambulante Pflege', 'Pflegedienst', 'Häusliche Pflege', 'Pflegegrad', 'Pflegepersonal'],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Viconia Care GmbH',
  },
}

export default async function FrontendRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
