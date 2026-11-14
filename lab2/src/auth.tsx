import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export const demoAccount = {
  email: 'student@example.com',
  password: 'lab2demo',
};

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login(email: string, password: string) {
    const matches = email.trim().toLowerCase() === demoAccount.email
      && password === demoAccount.password;

    if (matches) {
      setIsAuthenticated(true);
    }

    return matches;
  }

  function logout() {
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth requires AuthProvider');
  }

  return auth;
}
