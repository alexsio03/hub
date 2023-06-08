'use client'
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initFirebase } from '../firebase/config';
import { useAuthState } from "react-firebase-hooks/auth"
 
export default function Nav() {
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if(loading) {
    return <div>Loading...</div>
  }

  const signIn = async() => {
    const result = await signInWithPopup(auth, provider);
  }

  return <div className="px-2 py-3 font-medium text-slate-400 flex flex-row">
      <a
        href="../"
        className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
      >
        Home
      </a>
      <a
        href="./market"
        className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
      >
        Market
      </a>
      <a
        href="./trades"
        className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
      >
        Trades
      </a>
      <a className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 ml-auto">
        {user ? <button onClick={() => auth.signOut()}>{user.displayName}: Logout</button> : <button onClick={signIn}>Login</button>}
      </a>
    </div>
  }
