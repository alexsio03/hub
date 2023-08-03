import React, { useEffect, useState } from 'react';
import Nav from './components/nav';
import PriceUpdate from './helpers/prices/priceupdate.js'

export default function Home() {
  PriceUpdate();
  return (
    <>
      <Nav></Nav>
    </>
  )
}
