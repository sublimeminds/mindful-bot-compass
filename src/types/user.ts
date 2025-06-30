
export interface User {
  id: string;
  email: string;
  subscription_plan?: 'free' | 'premium' | 'pro';
  [key: string]: any;
}
