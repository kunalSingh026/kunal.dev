import type { Metadata } from 'next';
import { Outfit, Fira_Code } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const firaCode = Fira_Code({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Featured Projects - KUNAL • DEV',
  description: 'Full-Stack Developer & DevOps Engineer Personal Portfolio Ecosystem.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${outfit.variable} ${firaCode.variable} bg-[#FAF6EE] text-black min-h-full font-sans antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}