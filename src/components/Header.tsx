
import { useSimpleApp } from "@/hooks/useSimpleApp";
import DesktopHeader from "@/components/navigation/DesktopHeader";
import MobileHeader from "@/components/mobile/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { user } = useSimpleApp();
  const isMobile = useIsMobile();

  // Use mobile header for small screens
  if (isMobile) {
    return <MobileHeader />;
  }

  // Use desktop header for larger screens
  return <DesktopHeader />;
};

export default Header;
