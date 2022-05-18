import React from 'react'
import { useState } from 'react'
import { Wave } from '../../components/Background/Wave'
import { FormInput } from '../../components/FormInput/FormInput'
import { getRegisterSchemas } from '../../utils/inputSchemas'
import './register.css'

export const Register = () => {
  const [error, setError] = useState(null)

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    for (let element in values) {
      if (values[element].trim().length === 0) {
        setError('Fields cannot be empty')
      }
    }

    if (!error) {
      const form = new FormData()

      for (let element in values) {
        form.append(element, values[element])
      }
    }
  }

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
      <form action='' className='register__form' onSubmit={handleSubmit}>
        <h1 className='register__title'>Register now!</h1>
        {getRegisterSchemas(values).map((input) => (
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
