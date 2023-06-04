import Link from 'next/link';
import Tradecard from '../components/tradecard';

export default function Trades() {
  return (
    <div className='m-10'>
      <h1 className="title">
        Go <Link href="/">home</Link>
      </h1>
      <div>
        <Tradecard user="User 1"></Tradecard>
        <Tradecard user="User 2"></Tradecard>
        <Tradecard user="User 3"></Tradecard>
      </div>
    </div>
  )
}