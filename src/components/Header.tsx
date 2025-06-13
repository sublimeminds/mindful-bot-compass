
import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedNavigation from "@/components/navigation/AuthenticatedNavigation";
import PublicNavigation from "@/components/navigation/PublicNavigation";
import MobileHeader from "@/components/mobile/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Use mobile header for small screens
  if (isMobile) {
    return <MobileHeader />;
  }

  // Use regular navigation for desktop
  return user ? <AuthenticatedNavigation /> : <PublicNavigation />;
};

export default Header;
