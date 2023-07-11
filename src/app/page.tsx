"use client"
import axios from "axios";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from './components/nav';

export default function Home() {
  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await axios.get("/api/steam", { withCredentials: true});
        if (response.status === 200) {
          const data = response.data;
          console.log(data);
        } else {
          console.error("Error getting data:", response.status);
        }
      } catch(error) {
        console.error("Error getting data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Nav></Nav>
    </>
  )
}
