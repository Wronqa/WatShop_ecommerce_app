import React from 'react'

import './formInput.css'

export const FormInput = () => {
  return (
    <div className='formInput'>
      <label htmlFor='' className='formInput__label'>
        Username
      </label>
      <input type='text' className='formInput__input' />
    </div>
  )
}
