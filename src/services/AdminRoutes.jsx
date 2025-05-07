import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { isExpired, decodeToken } from 'react-jwt'
import { useAtom } from 'jotai'
import { CookieName, ErrorAlert } from '../utils/pageUtils'
import { useNavigate } from 'react-router-dom'
import { PROFILE } from './store'
import { Apis, AuthGetApi } from './API'
import Loader from '../GeneralComponents/Loader'


const AdminRoutes = ({ children }) => {
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
                if (unauthorized.role !== 'admin' && unauthorized.role !== 'super admin') {
                    return navigate('/login')
                }

                const response = await AuthGetApi(Apis.user.profile)
                if (response.status === 200) {
                    setLogin(true)
                    setProfile(response.msg)
                }
            } catch (error) {
                ErrorAlert(`${error.message}`)
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

export default AdminRoutes