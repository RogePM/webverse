import './globals.css';
import { PantryProvider } from '@/components/providers/PantryProvider';

export const metadata = {
  title: 'Food Arca | Food Bank Inventory Management',
  description: 'Food Bank inventory management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        
        <PantryProvider>
          {children}
         
        </PantryProvider>
      </body>
    </html>
  );
}
