import React from "react"

function Inicio({logo}) {

  return (
    <div className='flex flex-row'>
      <div>
        <div className='cont_logo border-black rounded-full dark:border-white '>
          <img src={logo} alt='Logo' />
        </div>
      </div>
      <div className='name_ pl-4 text-black dark:text-white'>
        <h5>Sergio_prada</h5>
        <p className="font-light dark:font-thin">programador</p>
      </div>
    </div>
  )
}

export default Inicio
