import Link from 'next/link';
import MarketcardRandom from '../components/marketcardR';
import Nav from '../components/nav';

export default function Market() {
  return (
    <>
      <Nav></Nav>
      <div className='m-6'>
        <div className="justify-center h-48 m-6">
          SEARCH FILTERS and allat
        </div>
        <div className='m-6 flex flex-row flex-wrap'>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
        </div>
    </div>
  </>
  )
}