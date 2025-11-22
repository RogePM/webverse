import './globals.css';
import { PantryProvider } from '@/components/providers/PantryProvider';

export const metadata = {
  title: 'FoodBank Admin | Inventory Management',
  description: 'FoodBank inventory management system',
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
