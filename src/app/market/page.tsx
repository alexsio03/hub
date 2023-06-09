import Link from 'next/link';
import Marketcard from '../components/marketcard';
import Nav from '../components/nav';
import data from '../skin-info/skins.json';

export default function Market() {
  const autoDisp = [];
  for (let i=0; i<20; i++){
    let randNum = Math.floor(Math.random()*1713);
    // 1713 is total skins in CSGO, found by this calc:
    // (Lines in src\app\skin-info\skins.json - 2)/13
    autoDisp[i] = data[randNum];
  }
  return (
    <div className='m-6'>
      <Nav></Nav>
      <div className="justify-center h-48">
        SEARCH FILTERS and allat
      </div>
        <div className='flex flex-row flex-wrap'>
          <Marketcard itemName="StatTrak™ M4A4 | Howl (Factory New)"></Marketcard>
        </div>
    </div>
  )
}