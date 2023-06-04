import Link from 'next/link';

export default function Home() {
  return (
    <div className="m-8 flex justify-center space-x-10">
      <h1 className="title">
        <Link href="market">Market</Link>
      </h1>
      <h1 className="title">
        <Link href="trades">Trades</Link>
      </h1>
      <h1 className="title">
        <Link href="login">Login</Link>
      </h1>
    </div>
  )
}
