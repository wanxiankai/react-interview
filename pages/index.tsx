import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import bgImage from '../public/bg.jpg'
import SearchCard from '../components/SearchCard'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zolplay React Interview Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0 w-full h-full">
        <Image
          src={bgImage}
          alt="Background"
          quality={100}
          fill
          className='object-cover object-center'
        />
      </div>
      <SearchCard />
    </>
  )
}

export default Home
