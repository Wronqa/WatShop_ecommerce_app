export const getRegisterSchemas = (values) => {
  return [
    {
      id: 1,
      name: 'username',
      placeholder: 'username',
      type: 'text',
      label: 'Username',
      error: 'Username should be 4-15 characters!',
      pattern: '.{4,15}',
      required: 'required',
    },
    {
      id: 2,
      name: 'email',
      placeholder: 'email',
      type: 'text',
      label: 'Email',
      error: 'Invalid email',
      pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
      required: 'required',
    },
    {
      id: 3,
      name: 'password',
      placeholder: 'password',
      type: 'password',
      label: 'Password',
      error: 'Password must be strong!',
      pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$',
      required: 'required',
    },
    {
      id: 4,
      name: 'confirmPassword',
      placeholder: 'confirm password',
      type: 'password',
      label: 'Confrim password',
      error: 'The password must be the same',
      required: 'required',
      pattern: values.password,
    },
  ]
}
