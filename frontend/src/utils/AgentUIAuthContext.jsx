import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: sessionStorage.getItem('agentUser') ? true : true,
  agentUser: null,
  redirectCount: 0, // Initialize redirect count
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        agentUser: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        agentUser: null,
      };
    case 'INCREMENT_REDIRECT_COUNT':
      return {
        ...state,
        redirectCount: state.redirectCount + 1, 
      };
    default:
      return state;
  }
};

const AgentUIAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
  );
};

const useAgentUILoginAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('agentUILoginAuth must be used within an AgentUIAuthProvider');
  }
  return context;
};

export { AgentUIAuthProvider, useAgentUILoginAuth };
