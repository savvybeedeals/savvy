import { client } from "@/services/client";
import { CATEGORIES_TREE_QUERY } from "@/lib/sanity.queries";
import { Category } from "@/types";

export async function getCategoriesTree(): Promise<Category[]> {
  try {
    const categories = await client.fetch(CATEGORIES_TREE_QUERY);
    return categories || [];
  } catch (error) {
    console.error("Error fetching categories tree from Sanity:", error);
    return [];
  }
}