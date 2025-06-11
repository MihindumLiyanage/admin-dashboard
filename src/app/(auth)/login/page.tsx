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
import { useTheme } from "@/contexts/ThemeContext";
import styles from "@/styles/pages/auth.module.scss";
import { Sun, Moon } from "@carbon/icons-react";

interface LoginFormData {
  username: string;
  password: string;
}

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setSuccess("");

    try {
      const userData = await authService.login(data.username, data.password);
      login(userData);
      setSuccess("You have been successfully logged in.");
      router.push("/home");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid credentials.");
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
          id="username"
          labelText="Username"
          placeholder="Enter your Username"
          {...register("username")}
          invalid={!!errors.username}
          invalidText={errors.username?.message}
          disabled={isSubmitting}
        />

        <PasswordInput
          id="password"
          labelText="Password"
          placeholder="Enter your Password"
          {...register("password")}
          invalid={!!errors.password}
          invalidText={errors.password?.message}
          disabled={isSubmitting}
        />

        <div className={styles.actions}>
          <a href="/forgot-password">Forgot your password?</a>
          <Button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
