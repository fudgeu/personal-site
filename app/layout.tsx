import './globals.css';
import { Source_Code_Pro } from 'next/font/google';

const sourceCodePro = Source_Code_Pro({ subsets: ['latin'] });

export const metadata = {
  title: 'fudgeu',
  description: 'personal portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sourceCodePro.className}>{children}</body>
    </html>
  );
}
