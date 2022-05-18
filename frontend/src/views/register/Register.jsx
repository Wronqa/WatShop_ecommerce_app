import React from 'react'
import { useState } from 'react'
import { Wave } from '../../components/Background/Wave'
import { FormInput } from '../../components/FormInput/FormInput'

import './register.css'

export const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const inputs = [
    {
      id: 1,
      name: 'username',
      placeholder: 'username',
      type: 'text',
      label: 'Username',
      error: 'Username should be 4-15 characters!',
      pattern: '.{4,15}',
    },
    {
      id: 2,
      name: 'email',
      placeholder: 'email',
      type: 'text',
      label: 'Email',
      error: 'Invalid email',
      pattern: '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/',
    },
    {
      id: 3,
      name: 'password',
      placeholder: 'password',
      type: 'password',
      label: 'Password',
      error: 'Password must be strong!',
      pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$',
    },
    {
      id: 4,
      name: 'confirmPassword',
      placeholder: 'confirm password',
      type: 'password',
      label: 'Confrim password',
      pattern: values.password,
      error: 'The password must be the same',
    },
  ]

  return (
    <div className='register'>
      <div className='register__navbar'>
        <div className='register__navbarWrapper'>
          <div className='register__navbarLeft'>
            <span className='register__navbarItem'>Nazwa sklepu</span>
          </div>
          <div className='register__navbarRight'>
            <span className='register__navbarItem'>Home</span>
            <span className='register__navbarItem'>Sign in</span>
          </div>
        </div>
      </div>
      <form action='' className='register__form'>
        <h1 className='register__title'>Register now!</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className='register__button'>Register</button>
      </form>
      <Wave />
    </div>
  )
}
