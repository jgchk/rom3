import { NextPage } from 'next'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { useLoginMutation, useRegisterMutation } from '../common/services/auth'

const Home: NextPage = () => {
  return (
    <div>
      <Register />
      <Login />
    </div>
  )
}

export default Home

const Register: FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading } = useRegisterMutation()
  const handleRegister = useCallback(
    () =>
      mutate(
        { username, password },
        {
          onSuccess: (res) => {
            toast.success(`Created account ${res.account.username}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [mutate, password, username]
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button
        type='submit'
        onClick={() => handleRegister()}
        disabled={isLoading}
      >
        Register
      </button>
    </form>
  )
}

const Login: FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading } = useLoginMutation()
  const handleLogin = useCallback(
    () =>
      mutate(
        { username, password },
        {
          onSuccess: (res) => {
            toast.success(`Logged in ${res.account.username}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [mutate, password, username]
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type='submit' onClick={() => handleLogin()} disabled={isLoading}>
        Login
      </button>
    </form>
  )
}
