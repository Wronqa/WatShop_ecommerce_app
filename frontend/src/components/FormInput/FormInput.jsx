import React, { useState } from 'react'

import './formInput.css'

export const FormInput = (props) => {
  const [focused, setFocused] = useState(false)

  const handleFocus = () => setFocused(!focused)

  const { label, onChange, error, ...others } = props

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
        onFocus={handleFocus}
        onBlur={handleFocus}
      />
      {focused && <span className='formInput__errorField'>{error}</span>}
    </div>
  )
}
