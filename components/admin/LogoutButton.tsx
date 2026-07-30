"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./admin.module.scss";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      className={styles.logoutButton}
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  );
}
