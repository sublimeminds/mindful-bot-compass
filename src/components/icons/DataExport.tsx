import React from 'react';
import dataExportIcon from '@/assets/icons/data-export.svg';

interface DataExportProps {
  className?: string;
  size?: number;
}

const DataExport: React.FC<DataExportProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={dataExportIcon} 
      alt="Data Export" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default DataExport;