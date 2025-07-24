import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  credits: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' as const,
    credits: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    credits: 1000,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('textpulse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find matching user (this would be a real API call in production)
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password for security
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('textpulse_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists (this would be handled by a real API)
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user (in a real app, this would be saved to a database)
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        password,
        role: 'user' as const,
        credits: 50, // Start with some free credits
        createdAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      // Auto-login the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('textpulse_user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('textpulse_user');
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email exists
      const userExists = mockUsers.some(u => u.email === email);
      if (!userExists) {
        throw new Error('Email not found');
      }
      
      // In a real app, this would send a password reset email
      console.log(`Password reset requested for ${email}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('textpulse_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};