import Tradecard from '../components/tradecard';
import Nav from '../components/nav';

/*
  1. A
  2.
  3.
  4.
*/

export default function Trades() {
  return (
      <>
        <Nav></Nav>
        <div className='m-6'>
          <div className='flex flex-row justify-center'>
            <button className='my-5 hover:text-gray-500'>Add Trade Listing!</button>
          </div>
          <div className='flex flex-row flex-wrap'>
          </div>
        </div>
      </>
  )
}