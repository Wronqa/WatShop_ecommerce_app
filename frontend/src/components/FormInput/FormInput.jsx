import React, { useEffect, useState } from 'react'

import './formInput.css'

export const FormInput = (props) => {
  const { label, onChange, error, ...others } = props

  const [activated, setActivated] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (isMounted)
      others.value.trim().length !== 0
        ? setActivated(true)
        : setActivated(false)

    return () => {
      isMounted = false
    }
  }, [others.value])

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
      {activated && <span className='formInput__errorField'>{error}</span>}
    </div>
  )
}
