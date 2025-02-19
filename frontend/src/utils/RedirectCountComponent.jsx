import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const RedirectPage = ({ redirectTo, countdownDuration }) => {
  const [countdown, setCountdown] = useState(countdownDuration);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      // Clear all data from local storage
      // localStorage.clear();
      // sessionStorage.clear();
      // Redirect to the specified page
      navigate(redirectTo);
    }
  }, [countdown, redirectTo]);

  return (
    <div style={{ fontSize: '30px', textAlign: 'center', marginTop: '150px'}}>
      <h1 style={{ marginBottom: '20px', fontWeight: 'bolder' }}>Login is Required</h1>
      <h2>Redirecting to login page in {countdown} seconds...</h2>
    </div>
  );
};

export default RedirectPage;
