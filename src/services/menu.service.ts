// src/services/menu.service.ts
import { apiClient } from "@/lib/api-client";

export interface MenuItem {
  id: string;
  label: string;
  slug: string;
  type: "COLLECTION" | "EXTERNAL";
  referenceId?: string | null;
}

export interface MenuGroup {
  id: string;
  title: string;
  image?: string | null;
  link?: string | null;
  items: MenuItem[];
}

export interface MenuData {
  id: string;
  name: string;
  slug: string;
  groups: MenuGroup[];
}

export const menuService = {
  /**
   * Fetches the Mega Menu data using the shared apiClient.
   * This uses the 'default-store' logic to ensure multi-tenant compatibility.
   */
  async getMegaMenu(slug: string = "main-menu"): Promise<MenuData | null> {
    try {
      // Using apiClient instead of native fetch to leverage global interceptors
      const response = await apiClient.get(`/menus/${slug}`);

      const rawData = response.data || response;
      // Your apiClient interceptor already returns response.data
      // We handle potential wrapping based on your observed API behavior

      if (!rawData) return null;
      return {
        id: rawData.id,
        name: rawData.name,
        slug: rawData.slug,
        // Ensure we are grabbing groups from the correct level
        groups: rawData.groups || [],
      };
    } catch (error) {
      console.error("MegaMenu fetch error:", error);
      return null;
    }
  },
};
