import React from 'react';
 
export default function Nav() {
  return <div className="px-2 py-3 font-medium text-slate-400 flex flex-row">
    <a
      href="../"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Home
    </a>
    <a
      href="../market"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Market
    </a>
    <a
      href="../trades"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
    >
      Trades
    </a>
    <a
      href="#"
      className="block px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 ml-auto"
    >
      Login
    </a>
  </div>
}
