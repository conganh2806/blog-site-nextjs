"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  LoginFormInput,
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/login.schema";

import styles from "./admin.module.scss";

interface LoginResponse {
  message?: string;
  success?: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const emailDescriptionId = errors.email
    ? "email-error"
    : serverError
      ? "login-error"
      : undefined;
  const passwordDescriptionId = errors.password
    ? "password-error"
    : serverError
      ? "login-error"
      : undefined;

  async function submitLogin(values: LoginFormValues) {
    setServerError("");

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setServerError(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setServerError("Unable to connect. Please try again.");
    }
  }

  return (
    <form
      className={styles.loginForm}
      onSubmit={handleSubmit(submitLogin)}
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="Enter your email"
          aria-describedby={emailDescriptionId}
          aria-invalid={Boolean(errors.email)}
          {...register("email", { onChange: () => setServerError("") })}
        />
        {errors.email ? (
          <p className={styles.fieldError} id="email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-describedby={passwordDescriptionId}
          aria-invalid={Boolean(errors.password)}
          {...register("password", { onChange: () => setServerError("") })}
        />
        {errors.password ? (
          <p className={styles.fieldError} id="password-error">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p className={styles.formError} id="login-error" role="alert">
          {serverError}
        </p>
      ) : null}

      <button
        className={styles.primaryButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
