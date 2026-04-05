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
  title: "Jorge Silva | Frontend Developer",
  description: "Portafolio de Jorge Silva, Desarrollador Frontend especializado en React, Next.js, Tailwind CSS y la creación de interfaces web modernas y eficientes.",
  keywords: ["Jorge Silva", "Frontend Developer", "Desarrollador Web", "React", "Next.js", "Portafolio", "Programador", "JavaScript"],
  authors: [{ name: "Jorge Silva" }],
  creator: "Jorge Silva",
  // Configuramos Open Graph para WhatsApp, LinkedIn, Facebook, etc.
  openGraph: {
    title: "Jorge Silva | Frontend Developer",
    description: "Explora mis proyectos y habilidades como Desarrollador Web enfocado en crear experiencias de usuario excepcionales.",
    url: "https://portfolio-jorge-silva-16.vercel.app/", // Sustituye con tu URL real
    siteName: "Portafolio de Jorge Silva",
    images: [
      {
        url: "/og-image.png", // Esta es la imagen que se mostrará
        width: 1200,
        height: 630,
        alt: "Preview del Portafolio de Jorge Silva",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  // Configuramos las tarjetas grandes para Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Jorge Silva | Frontend Developer",
    description: "Explora mis proyectos y habilidades como Desarrollador Web.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es" /* Cambiamos el idioma a español para el SEO */
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}