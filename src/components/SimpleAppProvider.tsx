
import React, { Component, ReactNode, createContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  user: User | null;
  loading: boolean;
  isOnline: boolean;
  appVersion: string;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setOnlineStatus: (status: boolean) => void;
}

// Create context with safe default values
export const SimpleAppContext = createContext<AppContextType>({
  user: null,
  loading: false,
  isOnline: true,
  appVersion: '1.0.0',
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
  setOnlineStatus: () => {},
});

interface Props {
  children: ReactNode;
}

interface State extends AppState {}

class SimpleAppProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
      isOnline: navigator.onLine,
      appVersion: '1.0.0',
    };
  }

  componentDidMount() {
    // Simple session check without complex async operations
    this.checkExistingSession();
    
    // Add simple online/offline listeners
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.setState({ isOnline: true });
  };

  private handleOffline = () => {
    this.setState({ isOnline: false });
  };

  private checkExistingSession = () => {
    try {
      const savedUser = localStorage.getItem('app_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.setState({ user });
      }
    } catch (error) {
      console.warn('Failed to check existing session:', error);
      localStorage.removeItem('app_user');
    }
  };

  private login = async (email: string, password: string) => {
    this.setState({ loading: true });
    
    try {
      // Simple mock authentication - replace with real auth later
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('app_user', JSON.stringify(mockUser));
      this.setState({ user: mockUser, loading: false });
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ loading: false });
      throw error;
    }
  };

  private logout = () => {
    localStorage.removeItem('app_user');
    this.setState({ user: null });
  };

  private updateUser = (userData: Partial<User>) => {
    if (this.state.user) {
      const updatedUser = { ...this.state.user, ...userData };
      this.setState({ user: updatedUser });
      localStorage.setItem('app_user', JSON.stringify(updatedUser));
    }
  };

  private setOnlineStatus = (status: boolean) => {
    this.setState({ isOnline: status });
  };

  render() {
    const contextValue: AppContextType = {
      ...this.state,
      login: this.login,
      logout: this.logout,
      updateUser: this.updateUser,
      setOnlineStatus: this.setOnlineStatus,
    };

    return (
      <SimpleAppContext.Provider value={contextValue}>
        {this.props.children}
      </SimpleAppContext.Provider>
    );
  }
}

export default SimpleAppProvider;
