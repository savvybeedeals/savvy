import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "xlug5h5i", // ضع الكود الخاص بك هنا
  dataset: "production",
  apiVersion: "2024-01-01", 
  useCdn: false, 
});