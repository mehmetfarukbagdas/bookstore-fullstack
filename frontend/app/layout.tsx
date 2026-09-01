import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { StoreProvider } from '@/lib/store-context'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Bağdaş Kitap Dünyası | Online Kitap Satış',
  description: 'Türkiye\'nin en geniş online kitap satış platformu. Binlerce kitap, uygun fiyatlar ve hızlı teslimat seçeneğiyle.',
  icons: {
    icon: '/favicon.ico', 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background suppressHydrationWarning">
        <StoreProvider>
          {children}
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}