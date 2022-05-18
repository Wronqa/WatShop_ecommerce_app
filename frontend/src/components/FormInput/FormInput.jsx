import React, { useState } from 'react'

import './formInput.css'

export const FormInput = (props) => {
  const { label, onChange, error, ...others } = props

  const [focused, setFocused] = useState(false)

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
      <span className='formInput__errorField'>{error}</span>
    </div>
  )
}
