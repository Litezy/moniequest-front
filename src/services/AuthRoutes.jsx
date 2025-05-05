import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { isExpired, decodeToken } from 'react-jwt'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { PROFILE } from './store'
import { Apis, AuthGetApi } from './API'
import { CookieName, ErrorAlert } from '../utils/pageUtils'
import ModalLayout from '../utils/ModalLayout'
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

        if (!token || isExpired(token)) {
          navigate('/login')
          return
        }

        const decoded = decodeToken(token)
        if (decoded?.role !== 'user') {
          navigate('/login')
          return
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

  // Show a loading spinner or nothing while verifying auth
  if (loading) {
    return <ModalLayout setModal={setLoading}>
             <Loader title={`loading`}/>
    </ModalLayout>
  }

  // If not logged in, children should not render
  if (!login) {
    return null
  }

  return children
}

export default AuthRoutes
