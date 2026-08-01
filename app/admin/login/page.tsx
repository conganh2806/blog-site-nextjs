import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import styles from "@/components/admin/admin.module.scss";
import { getAdminSession } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginPanel} aria-labelledby="login-title">
        <div className={styles.loginIntro}>
          <span aria-hidden="true">A</span>
          <div>
            <h1>Editorial control, made simple.</h1>
            <p>Manage stories, categories and publishing from one workspace.</p>
          </div>
        </div>

        <div className={styles.loginContent}>
          <h2 className={styles.loginHeading} id="login-title">
            Welcome back
          </h2>
          <p>Sign in to your Abstract administrator account.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
