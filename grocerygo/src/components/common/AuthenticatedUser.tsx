"use client"

import useGetAuthenticatedUser from '@/hooks/useGetAuthenticatedUser'

const AuthenticatedUser = () => {
     useGetAuthenticatedUser()

     return null
}

export default AuthenticatedUser