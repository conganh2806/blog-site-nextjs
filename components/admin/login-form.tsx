"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./admin.module.scss";

interface LoginResponse {
  message?: string;
  success?: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={error ? "login-error" : undefined}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={error ? "login-error" : undefined}
          required
        />
      </div>

      {error ? (
        <p className={styles.formError} id="login-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className={styles.primaryButton}
        type="submit"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

    </form>
  );
}
