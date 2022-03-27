import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import ButtonPrimary from '../common/components/ButtonPrimary'
import Input from '../common/components/Input'
import Label from '../common/components/Label'
import useLoggedInQuery from '../common/hooks/useLoggedInQuery'
import { useRegisterMutation } from '../common/services/auth'
import { getFirstOrValue } from '../common/utils/array'

const Register: NextPage = () => {
  const { query, push: navigate } = useRouter()

  const from = useMemo(() => getFirstOrValue(query.from), [query.from])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading } = useRegisterMutation()
  const handleRegister = useCallback(
    () =>
      mutate(
        { username, password },
        {
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [mutate, password, username]
  )

  const { data } = useLoggedInQuery()
  useEffect(() => {
    if (data) {
      // user is logged in. redirect
      void navigate(from ?? '/')
    }
  }, [data, from, navigate])

  return (
    <div className='flex justify-center'>
      <form
        className='space-y-2 mt-4'
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <ButtonPrimary
          type='submit'
          onClick={() => handleRegister()}
          disabled={isLoading}
        >
          Register
        </ButtonPrimary>
      </form>
    </div>
  )
}

export default Register
