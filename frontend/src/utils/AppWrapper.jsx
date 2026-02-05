import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function AppWrapper({ children }) {
  const [idleWarning, setIdleWarning] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Exclude the login page from showing the inactivity warning
    // if (location.pathname === '/app/login') return;

    const timeout = setTimeout(() => {
      setIdleWarning(true);
      startCountdown();
    }, 1 * 30 * 1000); // 30 seconds for testing purposes, change this to 5 * 60 * 1000 for 5 minutes

    const resetTimer = () => {
      setIdleWarning(false);
      setCountdown(0);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [location]);

  React.useEffect(() => {
    let countdownInterval;

    if (idleWarning && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    }

    // If countdown reaches 0, navigate to /app/login
    if (countdown === 0) {
      // navigate('/app/login');
      // Clear all local storage data
      // localStorage.clear();
    }

    return () => clearInterval(countdownInterval);
  }, [idleWarning, countdown, navigate]);

  const startCountdown = () => {
    setCountdown(10); // 5 minutes
  };

  const cancelLogout = () => {
    setIdleWarning(false);
    setCountdown(300); // Restart the countdown to 5 minutes
  };

  const handleStayHere = () => {
    setIdleWarning(false);
    startCountdown();
  };

  return (
    <AuthProvider>
      {children}
      <Modal
        open={idleWarning && location.pathname !== '/app/login'}
        onClose={handleStayHere}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <p>You will be logged out in {countdown} seconds due to inactivity.</p>
          <Button variant="contained" onClick={cancelLogout}>Logout</Button>
          <Button variant="contained" onClick={handleStayHere}>Stay Here</Button>
        </Box>
      </Modal>
    </AuthProvider>
  );
}

export default AppWrapper;
