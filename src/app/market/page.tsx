import Link from 'next/link';
import Marketcard from '../components/marketcard';
import Nav from '../components/nav';
import data from '../skin-info/skins.json';

export default function Market() {
  const autoDisplay = [];
  for (let i=0; i<20; i++){
    let randomSkin = Math.floor(Math.random()*1713);
    // 1713 is total skins in CSGO, found by this calc:
    // (Lines in src\app\skin-info\skins.json - 2)/13
    autoDisplay[i] = data[randomSkin];
  }
  return (
    <div className='m-6'>
      <Nav></Nav>
      <div className="justify-center h-48">
        SEARCH FILTERS and allat
      </div>
        <div className='flex flex-row flex-wrap'>
          {autoDisplay.map(randomSkin => <Marketcard itemNum={randomSkin}></Marketcard>)}
        </div>
    </div>
  )
}