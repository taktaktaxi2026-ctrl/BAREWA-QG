import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'BAREWA QG — Centre de Contrôle',
  description: "Centre de contrôle, de supervision et de pilotage privé et sécurisé de l'écosystème numérique BAREWA.",
  openGraph: {
    title: 'BAREWA QG — Centre de Contrôle',
    description: "Centre de contrôle, de supervision et de pilotage privé et sécurisé de l'écosystème numérique BAREWA.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BAREWA QG — Centre de Contrôle',
    description: "Centre de contrôle, de supervision et de pilotage privé et sécurisé de l'écosystème numérique BAREWA.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
