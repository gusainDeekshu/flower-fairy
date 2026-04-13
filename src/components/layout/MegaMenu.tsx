// src/components/layout/MegaMenu.tsx

import { menuService } from "@/services/menu.service";
import MegaMenuClient from "./MegaMenuClient";
// import MegaMenuClient from "./MegaMenuClient";

export default async function MegaMenu() {
  const menuData = await menuService.getMegaMenu('main-menu');

  if (!menuData || !menuData.groups) return null;

  return (
    <div className="hidden lg:block border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <MegaMenuClient groups={menuData.groups} />
      </div>
    </div>
  );
}