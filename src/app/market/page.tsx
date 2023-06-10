import Link from 'next/link';
import MarketcardRandom from '../components/marketcardR';
import Nav from '../components/nav';
import data from '../skin-info/skins.json';

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
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
          <MarketcardRandom></MarketcardRandom>
        </div>
    </div>
  )
}