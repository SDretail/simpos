import { Outlet } from 'react-router-dom';
import pkg from '../../../package.json';

export const RootLayout = () => {
  return (
    <>
      <Outlet />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 9999,
          padding: '4px 8px',
          fontSize: '0.75rem',
          color: 'rgba(0, 0, 0, 0.5)',
          background: 'rgba(255, 255, 255, 0.5)',
          borderTopRightRadius: '4px',
          pointerEvents: 'none',
        }}
      >
        Version: {pkg.version}
      </div>
    </>
  );
};
