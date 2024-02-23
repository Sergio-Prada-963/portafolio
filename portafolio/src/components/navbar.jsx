import React, { useEffect } from "react"

export const Navbar = () => {
  return (
    <>
      <div className='text-black dark:text-white'>
        Aquí va el nav-bar
        <button id='toggle-dark-mode' className="bg-btn_toggle dark:bg-btn_toggle_dark">Cambiar Modo</button>
      </div>
    </>
  )
}
