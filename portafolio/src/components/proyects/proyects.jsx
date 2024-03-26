import React from "react"

function Proyects() {
  return (
    <div className='welcome flex flex-col justify-center relative items-center select-none'>
      <canvas id='c' width='984' height='517'></canvas>
      <div className='info flex justify-center text-5xl text-white absolute items-center pointer-events-none backdrop-blur-sm rounded-2xl'>
        <span className='text-8xl mb-5'>{"{"}</span>
        &ensp; DEV&ensp;&ensp;
        <p className='overflow-hidden relative'></p>
        &ensp;&ensp;Sergio Prada &ensp;
        <span className='text-8xl mb-5'>{"}"}</span>
      </div>
    </div>
  )
}

export default Proyects
