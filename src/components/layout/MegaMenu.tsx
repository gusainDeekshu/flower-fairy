// src/components/layout/MegaMenu.tsx
import { menuService } from "@/services/menu.service";
import MegaMenuClient from "./MegaMenuClient";

export default async function MegaMenu() {
  const menuData = await menuService.getMegaMenu('main-menu');
  
  if (!menuData || !menuData.groups) return null;

  // Render the client logic directly with the fetched groups
  return <MegaMenuClient groups={menuData.groups} />;
}