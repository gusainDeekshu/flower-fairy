// src/components/layout/MegaMenu.tsx

import { menuService } from "@/services/menu.service";
import MegaMenuClient from "./MegaMenuClient";
import { MobileMenuDrawer } from "./MobileMenuDrawer";

export default async function MegaMenu() {
  const menuData = await menuService.getMegaMenu('main-menu');
  
  if (!menuData || !menuData.groups) return null;

  return (
    <>
      {/* Renders normally on Desktop */}
      <div className="hidden lg:block h-full w-full">
        <MegaMenuClient groups={menuData.groups} />
      </div>
      
      {/* Renders globally on Mobile (via React portals/fixed-layout) */}
      <div className="block lg:hidden">
        <MobileMenuDrawer groups={menuData.groups} />
      </div>
    </>
  );
}