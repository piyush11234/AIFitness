import React from 'react'
import Hero from '../components/Hero'
import About from './About'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900'>
        <Hero/>
        <About/>
    </div>
  )
}

export default Home