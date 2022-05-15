import React from 'react'

import './formInput.css'

export const FormInput = (props) => {
  const { label, onChange, ...others } = props
  return (
    <div className='formInput'>
      <label htmlFor='' className='formInput__label'>
        {label}
      </label>
      <input
        type='text'
        {...others}
        className='formInput__input'
        onChange={onChange}
      />
    </div>
  )
}
