import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Web Verse | Custom Web Development for NC Triad Businesses",
  description: "Web Verse builds high-performance, custom websites for small businesses in Greensboro, Winston-Salem, and High Point, NC. Specializing in web development that boosts revenue and engagement.",
  keywords: [
    "web design greensboro nc",
    "web development triad",
    "small business website north carolina",
    "custom website development",
    "freelance web developer nc",
    "high point web design",
    "winston-salem web developer"
  ],
  authors: [{ name: "Web Verse" }],
  alternates: {
    canonical: "https://your-domain.com",
  },
  openGraph: {
    type: "website",
    url: "https://your-domain.com/",
    title: "Web Verse | Custom Web Development for NC Triad Businesses",
    description: "High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point.",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Web Verse OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://your-domain.com/",
    title: "Web Verse | Custom Web Development for NC Triad Businesses",
    description: "High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point.",
    images: ["https://your-domain.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
