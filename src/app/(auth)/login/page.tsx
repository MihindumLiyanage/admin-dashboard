"use client";

import { Button, TextInput, PasswordInput } from "@carbon/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from "@/components/common/Toast";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/pages/auth.module.scss";

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setSuccess("");

    try {
      const userData = await authService.login(data.email, data.password);
      login(userData);
      setSuccess("You have been successfully logged in.");

      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <img
          src="/images/logo.png"
          alt="Login Illustration"
          className={styles.heroImage}
          loading="lazy"
        />
        <h1>Login</h1>

        {error && (
          <Toast
            kind="error"
            title="Login Failed"
            subtitle={error}
            onClose={() => setError("")}
          />
        )}

        {success && (
          <Toast
            kind="success"
            title="Login Successful"
            subtitle={success}
            onClose={() => setSuccess("")}
          />
        )}

        <TextInput
          id="email"
          labelText="Email"
          placeholder="admin@example.com"
          {...register("email")}
          invalid={!!errors.email}
          invalidText={errors.email?.message}
        />

        <PasswordInput
          id="password"
          labelText="Password"
          {...register("password")}
          invalid={!!errors.password}
          invalidText={errors.password?.message}
        />

        <div className={styles.actions}>
          <a href="/forgot-password">Forgot your password?</a>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
}
