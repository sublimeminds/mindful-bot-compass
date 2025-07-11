import React from 'react';
import { Outlet } from 'react-router-dom';
import CookieConsentPopup from '@/components/CookieConsentPopup';

const AppLayout = () => {
  return (
    <>
      <Outlet />
      <CookieConsentPopup />
    </>
  );
};

export default AppLayout;