
import React, { Component, ReactNode, createContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context with safe default values
export const MinimalAuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

interface State {
  user: User | null;
  loading: boolean;
}

class MinimalAuthProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
    };
  }

  componentDidMount() {
    // Simple check for existing session
    this.checkExistingSession();
  }

  private checkExistingSession = () => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.setState({ user });
      }
    } catch (error) {
      console.warn('Failed to check existing session:', error);
      localStorage.removeItem('auth_user');
    }
  };

  private login = async (email: string, password: string) => {
    this.setState({ loading: true });
    
    try {
      // Simulate login - replace with real auth later
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      this.setState({ user: mockUser, loading: false });
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ loading: false });
      throw error;
    }
  };

  private logout = () => {
    localStorage.removeItem('auth_user');
    this.setState({ user: null });
  };

  render() {
    const contextValue: AuthContextType = {
      user: this.state.user,
      loading: this.state.loading,
      login: this.login,
      logout: this.logout,
    };

    return (
      <MinimalAuthContext.Provider value={contextValue}>
        {this.props.children}
      </MinimalAuthContext.Provider>
    );
  }
}

export default MinimalAuthProvider;
