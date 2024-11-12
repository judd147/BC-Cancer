import { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextProps {
  isAuthed: boolean;
  setIsAuthed: (value: boolean) => void;
  user: {id: number, username: string};
  setUser: (value: {id: number, username: string}) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<{id: number, username: string}>({id: 0, username: ""});

  return (
    <AuthContext.Provider value={{ isAuthed, setIsAuthed, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
