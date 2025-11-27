
import {
  LayoutDashboard,
  PlusSquare,
  MinusSquare,
  Boxes,
  History,
  Calendar,
  Settings,
  Archive,
  Snowflake,
  Carrot,
  Croissant,
  Cylinder,
  Beef,
  GlassWater,
  BookXIcon,
  MilkIcon,
  UserRoundSearchIcon
} from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, view: 'Dashboard' },
  { name: 'Add Items', icon: PlusSquare, view: 'Add Items' },
  { name: 'Remove Items', icon: MinusSquare, view: 'Remove Items' },
  { name: 'View Inventory', icon: Boxes, view: 'View Inventory' },
  { name: 'Recent Changes', icon: History, view: 'Recent Changes' },
  { name: 'View Clients', icon: UserRoundSearchIcon, view: 'View Clients' },
];

export const dashboardActions = [
  {
    title: 'Add Items',
    description: 'Log new donations and purchases.',
    icon: PlusSquare,
    view: 'Add Items',
  },
  {
    title: 'Remove Items',
    description: 'Distribute items and update stock.',
    icon: MinusSquare,
    view: 'Remove Items',
  },
  {
    title: 'View Inventory',
    description: 'Check current stock levels.',
    icon: Boxes,
    view: 'View Inventory',
  },
  {
    title: 'Recent Changes',
    description: 'Audit log of all inventory movements.',
    icon: History,
    view: 'Recent Changes',
  },
  {
    title: 'View Clients',
    description: 'View clients recieving food.',
    icon: UserRoundSearchIcon, 
    view: 'View Clients'
  },
{
  title: 'Settings',
    description: 'Manage organization and user settings.',
      icon: Settings,
        view: 'Settings',
  },
];

export const categories = [
  { name: 'Dry Goods', icon: Archive, value: 'dry_goods' },
  { name: 'Frozen Food', icon: Snowflake, value: 'frozen_food' },
  { name: 'Produce', icon: Carrot, value: 'produce' },
  { name: 'Proteins', icon: Beef, value: 'proteins' },
  { name: 'Bakery & Snacks', icon: Croissant, value: 'bakery_snacks' },
  { name: 'Canned Goods', icon: Cylinder, value: 'canned_goods' },
  { name: 'Beverages', icon: GlassWater, value: 'beverages' },
  { name: 'Dairy', icon: MilkIcon, value: 'dairy' },
  { name: 'Other', icon: BookXIcon, value: 'Other' },  // catch-all
];

