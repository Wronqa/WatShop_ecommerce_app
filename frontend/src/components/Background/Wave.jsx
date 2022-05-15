import React from 'react'

import './wave.css'

export const Wave = () => {
  return (
    <svg
      id='svg'
      viewBox='0 0 1440 400'
      xmlns='http://www.w3.org/2000/svg'
      className='transition duration-300 ease-in-out delay-150 wave'
    >
      <path
        d='M 0,400 C 0,400 0,200 0,200 C 95.71428571428572,184.89285714285714 191.42857142857144,169.78571428571428 312,194 C 432.57142857142856,218.21428571428572 578.0000000000001,281.75 693,274 C 807.9999999999999,266.25 892.5714285714287,187.21428571428572 1012,163 C 1131.4285714285713,138.78571428571428 1285.7142857142858,169.39285714285714 1440,200 C 1440,200 1440,400 1440,400 Z'
        stroke='none'
        strokeWidth='0'
        fill='#490b3d'
        className='transition-all duration-300 ease-in-out delay-150 path-0'
      ></path>
    </svg>
  )
}
