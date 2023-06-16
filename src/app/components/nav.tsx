'use client'
import React from 'react';
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"; 
import { signIn } from '../firebase/signin';
 
export default function Nav() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  return <div className="px-2 py-1 font-medium text-slate-400 flex flex-row">
      <a
        href="../"
        className="block px-3 py-3 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
      >
        Home
      </a>
      <a
        href="./market"
        className="block px-3 py-3 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
      >
        Market
      </a>
      <a
        href="./trades"
        className="block px-3 py-3 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
      >
        Trades
      </a>
      <a className='px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 ml-auto mr-10' href='/auth/steam'>Steam</a>
      <a className="flex px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 flex-row">
        {user 
        ? <><img className='mr-2 rounded-full h-8 w-8' src={user.photoURL}></img><button onClick={() => auth.signOut()}>{user.displayName}: Logout</button></> 
        : loading ? <>Loading...</> : <button onClick={signIn}>Login</button>} 
      </a>
    </div>
  }
