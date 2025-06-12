import { post } from "@/services/httpService";
import { User } from "@/types/user";

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  const response = await post("/auth/login", { username, password });

  return {
    username: username, 
    token: response.data.auth_token,
  };
};

export const logout = (): void => {
  localStorage.removeItem("authUser");
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem("authUser");
  return stored ? JSON.parse(stored) : null;
};
