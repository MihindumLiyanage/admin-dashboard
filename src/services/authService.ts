import { post } from "@/services/httpService";
import { User } from "@/types/user";

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const response = await post("/auth/login", { username, password });

    const user: User = {
      username,
      token: response.data.auth_token, 
    };

    localStorage.setItem("authUser", JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem("authUser");
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  },
};
