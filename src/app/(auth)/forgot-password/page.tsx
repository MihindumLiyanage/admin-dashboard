"use client";

import { Button, TextInput } from "@carbon/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/authService";
import Toast from "@/components/common/Toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "@carbon/icons-react";
import styles from "@/styles/pages/auth.module.scss";

interface ForgotPasswordFormData {
  email: string;
}

const forgotSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotSchema),
  });

  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { theme, toggleTheme } = useTheme();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    setSuccess("");

    try {
      await authService.forgotPassword(data.email);
      setSuccess("If an account exists, a reset link has been sent.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("There was an issue sending the reset email.");
    }
  };

  return (
    <div className={styles.container} data-theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.themeToggle} onClick={toggleTheme}>
          {theme === "white" ? <Moon size={24} /> : <Sun size={24} />}
        </div>

        <img
          src="/images/logo.png"
          alt="Reset Illustration"
          className={styles.heroImage}
          loading="lazy"
        />
        <h1>Reset Password</h1>

        {success && (
          <Toast
            kind="success"
            title="Email Sent"
            subtitle={success}
            onClose={() => setSuccess("")}
          />
        )}

        {error && (
          <Toast
            kind="error"
            title="Unable to send the link"
            subtitle={error}
            onClose={() => setError("")}
          />
        )}

        <TextInput
          id="email"
          labelText="Email"
          placeholder="you@example.com"
          {...register("email")}
          invalid={!!errors.email}
          invalidText={errors.email?.message}
        />

        <div className={styles.actions}>
          <a href="/login">Login</a>
          <Button type="submit" className={styles.loginButton}>
            Send Reset Link
          </Button>
        </div>
      </form>
    </div>
  );
}
