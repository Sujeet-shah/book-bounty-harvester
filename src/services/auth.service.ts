
/**
 * Authentication Service
 * 
 * In a production application, this would connect to your backend API
 * for authentication, token management, and session validation.
 */

// Types for user data
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for registration data
interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication service - handles login, registration, and session management
 * 
 * For production use:
 * - Replace localStorage with secure HTTP-only cookies
 * - Add CSRF protection
 * - Add JWTs or other secure token handling
 * - Implement proper password hashing on the backend
 */
class AuthService {
  /**
   * Login a user with email and password
   * In production: This would call your authentication API
   */
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get demo admin credentials
    const ADMIN_EMAIL = 'admin@example.com';
    const ADMIN_PASSWORD = 'admin123';
    
    try {
      // Check if admin login
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        // Create admin user object
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'
        };
        
        // Set admin logged in state
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        
        return adminUser;
      }
      
      // Check if regular user (in production, this would be a backend API call)
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const user = users.find((user: any) => 
        user.email === credentials.email && user.password === credentials.password
      );
      
      if (user) {
        // Create user object
        const authenticatedUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        };
        
        // Set user logged in state
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        
        return authenticatedUser;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Register a new user
   * In production: This would call your registration API
   */
  async register(data: RegistrationData): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // In a real app, this would be sent to your backend
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email already exists
      const existingUser = users.find((user: any) => user.email === data.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      // Add the new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password, // In a real app, NEVER store passwords in plain text
        role: 'user' as const, // Fixed: Use 'as const' to ensure TypeScript recognizes this as a literal type
        dateRegistered: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create user object to return
      const registeredUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      // Set user as logged in
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(registeredUser));
      
      return registeredUser;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Logout the current user
   * In production: This would invalidate sessions on the backend
   */
  async logout(): Promise<void> {
    // Clear auth data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
  }
  
  /**
   * Get the current authenticated user
   * In production: This would validate the session with your backend
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  /**
   * Check if user is authenticated
   * In production: This would validate the session token with your backend
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('userLoggedIn') === 'true';
  }
  
  /**
   * Check if user is an admin
   * In production: This would validate admin role with your backend
   */
  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    const user = this.getCurrentUser();
    return isAdmin && !!user && user.role === 'admin';
  }
  
  /**
   * Update user profile
   * In production: This would call your user profile API
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      // Update users in localStorage
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const updatedUsers = users.map((user: any) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            ...updates,
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user in localStorage
      const updatedUser = {
        ...currentUser,
        ...updates,
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();
