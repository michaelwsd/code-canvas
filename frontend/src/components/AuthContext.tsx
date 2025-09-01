import { createContext, useContext, useState } from "react";
import type { AuthContextType, AuthProviderProps } from "@/utils/types";

// 2. Create context with proper type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
