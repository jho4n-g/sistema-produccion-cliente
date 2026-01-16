import { useContext } from 'react';
import AuthProvider from '../providers/auth.provider';

const useAuth = () => {
  return useContext(AuthProvider);
};

export default useAuth;
