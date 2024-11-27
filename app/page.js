'use client';

import { useEffect } from 'react';
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
   const isLoggedIn = sessionStorage.getItem('HUID');

    if (!isLoggedIn) {
      router.push('/login');
    } else {
      router.push('/user');
    }
  }, [router]);

  return null;
};

export default Home;
