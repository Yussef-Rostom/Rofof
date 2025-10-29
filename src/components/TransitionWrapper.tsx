import React from 'react';
import { useLocation } from 'react-router-dom';

interface TransitionWrapperProps {
  children: React.ReactNode;
}



const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="fade-transition">
      {children}
    </div>
  );
};

export default TransitionWrapper;
