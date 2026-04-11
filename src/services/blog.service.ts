// src/services/blog.service.ts

import { apiClient } from "@/lib/api-client";

export interface BlogQueryParams {
  category?: string;
  search?: string;
  isFeatured?: boolean;
}

export const BlogService = {
  // ✅ GET ALL BLOGS
  getBlogs: async (params?: BlogQueryParams) => {
    try {
      const query: Record<string, any> = {};

      if (params?.category && params.category !== "all") {
        query.category = params.category;
      }

      if (params?.search) {
        query.search = params.search;
      }

      if (params?.isFeatured !== undefined) {
        query.isFeatured = params.isFeatured;
      }

      const res = await apiClient.get("/blogs", {
        params: query,
      });

      return res.data; // ✅ always return clean data
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  },

  // ✅ GET BLOG BY SLUG
  getBlogBySlug: async (slug: string) => {
    try {
      const res = await apiClient.get(`/blogs/${slug}`);
      return res.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      console.error("Error fetching blog:", error);
      throw error;
    }
  },

  // ✅ GET CATEGORIES
  getCategories: async () => {
    try {
      const res = await apiClient.get("/blogs/categories");
      return res.data; // ✅ important fix (no AxiosResponse leak)
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};