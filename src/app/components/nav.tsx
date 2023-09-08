// Import necessary dependencies
'use client';
import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"; 
import { signIn } from '../fb/setdata';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { initDB, initFirebase } from '../fb/config';
import { doc, getDoc } from 'firebase/firestore';

// Define the navigation items
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Market', href: '/market' },
  { name: 'Trades', href: '/trades' },
  { name: 'Prices', href: '/prices' },
]

// Helper function to handle CSS class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Initialize Firebase
initFirebase();
const db = initDB();

export default function Nav() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [steamData, setSteamData] = useState("Connect to Steam");
  const [steamRef, setSteamRef] = useState("/api/auth/steam");
  const isActive = usePathname();

  // Fetch user data from Firestore
  const getUser = async () => {
    if(user) {
      const dbUser = await doc(db, "users", user.uid);
      const userSnap = await getDoc(dbUser);
      return userSnap.data();
    }
  }

  // Check if user has Steam data and set the appropriate values
  const checkSteam = async () => {
    getUser().then((info) => {
      if(info && info.steam_info) {
        setSteamRef(info.steam_info.url)
        setSteamData(info.steam_info.name)
      } else {
        setSteamRef("/api/auth/steam");
        setSteamData("Connect to Steam");
      }
    });
  }
  checkSteam();

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://static.thenounproject.com/png/899817-200.png"
                    alt="Karambit Logo"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://static.thenounproject.com/png/899817-200.png"
                    alt="Karambit Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {/* Render navigation links */}
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          isActive === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={isActive === item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {user ? (
                  <Menu as="div" className="relative inline-block text-left ml-auto mr-10">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <><img className='rounded-full h-10 w-10' src={user.photoURL?.toString()}></img></>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ disabled }) => (
                              <p
                                className={classNames(
                                  disabled ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                {/* Render user information or loading state */}
                                {user ? (
                                  <>Current User: {user.displayName}</>
                                ) : (
                                  loading ? (
                                    <>Loading...</>
                                  ) : (
                                    <button onClick={signIn}>Login</button>
                                  )
                                )}
                              </p>
                            )}
                          </Menu.Item>
                        </div>
                        <div className='py-1'>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={steamRef}
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                {steamData}
                              </a>
                            )}
                          </Menu.Item>
                          {steamRef != "/api/auth/steam" ? (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/inventory"
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-sm'
                                  )}
                                >
                                  Inventory
                                </a>
                              )}
                            </Menu.Item>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Profile
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Transactions
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                <button onClick={() => auth.signOut()}>Logout</button>
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <a className="flex ml-auto mr-10 px-3 py-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 flex-row">
                    {/* Render login button or loading state */}
                    {loading ? (
                      <p className='py-2'>Loading...</p>
                    ) : (
                      <button onClick={signIn}>Login</button>
                    )}
                  </a>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Render mobile navigation links */}
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    isActive === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={isActive === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
