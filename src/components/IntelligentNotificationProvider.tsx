
import { useIntelligentNotifications } from '@/hooks/useIntelligentNotifications';

const IntelligentNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  // This hook will automatically handle intelligent notification generation
  useIntelligentNotifications();
  
  return <>{children}</>;
};

export default IntelligentNotificationProvider;
