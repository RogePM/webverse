import './globals.css';

export const metadata = {
  title: 'FoodBank Admin | Inventory Management',
  description: 'FoodBank inventory management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

