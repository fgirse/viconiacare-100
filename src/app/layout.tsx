import type { Metadata } from 'next';
import { Playfair_Display, Lato, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import '@/src/app/globals.css';

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

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') ?? 'de'
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${playfair.variable} ${lato.variable} ${jetbrains.variable}`}
    >
      <body
        className="font-body antialiased bg-white text-stone-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
