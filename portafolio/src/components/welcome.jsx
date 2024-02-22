import React from "react"

export const Welcome = () => {
  return (
    <div className='welcome flex flex-col justify-center relative items-center'>
      <canvas id='c' width='984' height='517'></canvas>
      <div className='info flex justify-center text-5xl text-white absolute items-center pointer-events-none backdrop-blur-sm'>
        <span className='text-8xl mb-5'>{"{"}</span>&ensp; DEV&ensp;&ensp;<p className='overflow-hidden relative'></p>
        &ensp;&ensp;Sergio Prada &ensp;<span className='text-8xl mb-5'>{"}"}</span>
      </div>
    </div>
  )
}
