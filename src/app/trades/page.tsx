import Tradecard from '../components/tradecard';
import Nav from '../components/nav';

/*
Flow:
  1. Load user inventory
  2. Load all trades from database
  3. On button press
    1) Display all user's items on one side (redirect to page like cs.money trade)
    2) Display all possible items on other side (search bar)
    3) Show prices on both sides
    4) Submit and add to database
  4. Refresh page
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