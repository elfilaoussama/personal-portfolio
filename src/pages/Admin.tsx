import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function Admin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to home page since admin is accessed via modal
    setLocation('/');
  }, [setLocation]);

  return null;
}
