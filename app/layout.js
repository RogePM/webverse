import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Luminary Sites | Custom Web Development for NC Triad Businesses",
  description: "Luminary Sites builds high-performance, custom websites for small businesses in Greensboro, Winston-Salem, and High Point, NC. Specializing in web development that boosts revenue and engagement.",
  keywords: [
    "web design greensboro nc",
    "web development triad",
    "small business website north carolina",
    "custom website development",
    "freelance web developer nc",
    "high point web design",
    "winston-salem web developer"
  ],
  authors: [{ name: "Luminary Sites" }],
  alternates: {
    canonical: "https://your-domain.com",
  },
  icons: {
    icon: [
      { url: '/actualyLogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/actualyLogo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/actualyLogo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://your-domain.com/",
    title: "Luminary Sites | Custom Web Development for NC Triad Businesses",
    description: "High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point.",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luminary Sites OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://your-domain.com/",
    title: "Luminary Sites | Custom Web Development for NC Triad Businesses",
    description: "High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point.",
    images: ["https://your-domain.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/actualyLogo.png" />
        <link rel="apple-touch-icon" href="/actualyLogo.png" />
      </head>
      <body
        className="font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
