import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { isExpired, decodeToken } from 'react-jwt'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { PROFILE } from './store'
import { Apis, AuthGetApi } from './API'
import { CookieName, ErrorAlert } from '../utils/pageUtils'


const AuthRoutes = ({ children }) => {
    const [, setProfile] = useAtom(PROFILE)
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
                    setLogin(true)
                    setProfile(response.msg)
                }
            } catch (error) {
                ErrorAlert(`${error.message}`)
            }
        }

        ValidateEntrance()

    }, [])

    if (login) return children
}

export default AuthRoutes