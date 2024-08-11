"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTableDemo } from '@/components/table';
import { Avatars } from '@/components/Avatars';
import { app } from "@/firebaseConfig";
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import Profile from '../profile/page';

const Dashboard = () => {
  const [showMainContent, setShowMainContent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.email);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/'); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setShowMainContent(true);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className='flex:1'>
      {!showMainContent ? (
        <Profile />
      ) : (
        <>
          <header className='flex flex-row py-5 px-10 justify-between'>
            <div className='flex flex-row'>
              <Avatars />
              <h2 className='py-3 px-4'>{name}</h2>
            </div>
            <button onClick={handleSignOut}>Terminar sessão</button>
          </header>
          <main className='mx-10'>
            <DataTableDemo />
          </main>
        </>
      )}
    </main>
  );
};

export default Dashboard;
