
export interface NavigationMenu {
  id: string;
  name: string;
  label: string;
  icon: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationMenuItem {
  id: string;
  menu_id: string;
  category_id?: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  badge?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavigationMenuCategory {
  id: string;
  menu_id: string;
  name: string;
  label: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuConfiguration {
  menus: NavigationMenu[];
  items: NavigationMenuItem[];
  categories: NavigationMenuCategory[];
}
