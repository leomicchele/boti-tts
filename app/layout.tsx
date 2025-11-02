import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Azure TTS Playground",
  description: "Playground para probar el servicio de Text-to-Speech de Azure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
