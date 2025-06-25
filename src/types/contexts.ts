
// Types for context providers to fix Fast Refresh issues
export interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface TherapistContextType {
  selectedTherapist: string | null;
  setSelectedTherapist: (id: string) => void;
}

export interface AdminContextType {
  isAdmin: boolean;
  adminRole: string | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}
