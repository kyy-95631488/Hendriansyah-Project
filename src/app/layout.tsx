import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hendriansyah Rizky Setiawan - Portfolio",
  description: "Portfolio showcasing my skills and projects as a Full-Stack Developer specializing in web and mobile applications.",
  openGraph: {
    title: "Hendriansyah Rizky Setiawan - Portfolio",
    description: "Explore my work as a Full-Stack Developer with expertise in React, Next.js, Kotlin, and Flutter.",
    url: "https://hendriansyah-project.vercel.app/",
    siteName: "Hendriansyah Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hendriansyah Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hendriansyah Rizky Setiawan - Portfolio",
    description: "Discover my projects and skills as a Full-Stack Developer.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://hendriansyah-project.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="QcbyU9ulSTslAaeS9j0MmZGr0ZdAR7c3RvstcFuKYsk" />
        <link rel="icon" href="/images/logo-hr.png" sizes="any" />
        <link rel="preload" href="/images/pribadi-kartun.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Hendriansyah Rizky Setiawan",
              jobTitle: "Full-Stack Developer",
              url: "https://hendriansyah-project.vercel.app/",
              sameAs: [
                "https://github.com/kyy-95631488",
                "https://www.linkedin.com/in/hendriansyah-rizky-setiawan-8b4a68308/",
                "https://www.instagram.com/cerberus404x/",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white font-sans scrollbar-hide`}
      >
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}