import { User } from "@/types/user";
import mockData from "@/mock/mockData.json";

const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem("mockUsers");
  return stored ? JSON.parse(stored) : mockData.users;
};

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const users = getStoredUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");

    const authUser = { ...user, token: "mock-token" };
    localStorage.setItem("authUser", JSON.stringify(authUser));
    return authUser;
  },

  async forgotPassword(email: string): Promise<void> {
    const users = getStoredUsers();
    users.some((u) => u.email === email);
    return Promise.resolve();
  },

  logout(): void {
    localStorage.removeItem("authUser");
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  },
};
