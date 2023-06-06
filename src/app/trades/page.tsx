import Link from 'next/link';
import Tradecard from '../components/tradecard';
import Nav from '../components/nav';

export default function Trades() {
  return (
      <div className='m-6'>
        <Nav></Nav>
        <div className='flex flex-row justify-center'>
          <button className='my-5 hover:text-gray-500'>Add Trade Listing!</button>
        </div>
        <div className='flex flex-row flex-wrap'>
          <Tradecard user="User 1"></Tradecard>
          <Tradecard user="User 2"></Tradecard>
          <Tradecard user="User 3"></Tradecard>
          <Tradecard user="User 4"></Tradecard>
          <Tradecard user="User 5"></Tradecard>
        </div>
      </div>
  )
}