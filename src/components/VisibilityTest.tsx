
import React from 'react';

const VisibilityTest = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '60px', 
      backgroundColor: 'red', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 9999, 
      fontSize: '20px', 
      fontWeight: 'bold' 
    }}>
      TEST HEADER - CAN YOU SEE THIS?
    </div>
  );
};

export default VisibilityTest;
