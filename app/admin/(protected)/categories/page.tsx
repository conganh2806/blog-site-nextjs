import type { Metadata } from "next";

import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Manage categories" };

export default function AdminCategoriesPage() {
  return <CategoryManager />;
}
