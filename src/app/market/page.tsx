import Link from 'next/link';
import MarketcardRandom from '../components/marketcardR';
import Nav from '../components/nav';

export default function Market() {
  return (
    <div className='m-6'>
      <Nav></Nav>
      <div className="justify-center h-48">
        SEARCH FILTERS and allat
      </div>
        <div className='flex flex-row flex-wrap'>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
        </div>
    </div>
  )
}