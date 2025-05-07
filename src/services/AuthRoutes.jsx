import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { isExpired, decodeToken } from 'react-jwt'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { PROFILE } from './store'
import { Apis, AuthGetApi } from './API'
import { CookieName, ErrorAlert } from '../utils/pageUtils'
import Loader from '../GeneralComponents/Loader'

const AuthRoutes = ({ children }) => {
  const [, setProfile] = useAtom(PROFILE)
  const [loading, setLoading] = useState(true)
  const [login, setLogin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const ValidateEntrance = async () => {
      try {
        const token = Cookies.get(CookieName)
        const isinValid = isExpired(token)
        if (!token) {
          return navigate('/login')
        }
        if (isinValid) {
          return navigate('/login')
        }
        const unauthorized = decodeToken(token)
        if (unauthorized.role !== 'user') {
          return navigate('/login')
        }

        const response = await AuthGetApi(Apis.user.profile)
        if (response.status === 200) {
          setProfile(response.msg)
          setLogin(true)
        } else {
          navigate('/login')
        }
      } catch (error) {
        ErrorAlert(`${error.message}`)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    ValidateEntrance()
  }, [])

  if (loading) {
    return <Loader title={`loading`} />
  }
  if (login) return children
}

export default AuthRoutes
