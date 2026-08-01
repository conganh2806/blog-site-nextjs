import type { Metadata } from "next";

import { PostManager } from "@/components/admin/post-manager";

export const metadata: Metadata = { title: "Manage posts" };

export default function AdminPostsPage() {
  return <PostManager />;
}
