import React from 'react'
import {appleImg, bagImg, searchImg} from '../utils'
import {navLists} from "../constants"

const Navbar = () => {
  return (
    <header className='w-full py-8 sm:px-10 px-5 flex justify-between items-center'>
      <nav className='flex w-full screen-max-width'>
        <img src={appleImg} alt="Apple" width={14}
        height={18} />
        <div className='flex flex-1 justify-center max-md:hidden'>
          {navLists.map((nav,i)=>{
            return (
              <div key={i} className='px-5 text-sm text-gray hover:text-white transition-all cursor-pointer'>
                {nav}
              </div>
            )
          })}
        </div>

        <div className='flex items-baseline gap-7 max-md:justify-end max-md:flex-1'>
          <img src={searchImg} alt="search" width={18}
          height={18} />
          <img src={bagImg} alt="bag" width={18}
          height={18} />
        </div>
      </nav>
    </header>
  )
}

export default Navbar