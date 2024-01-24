import React, {useContext} from "react"
import {Outlet, Navigate} from "react-router-dom"
import AuthContext from "../context/AuthContext"


const PrivateRoute = ({children, ...rest}) => {
    const {user} = useContext(AuthContext)
    return user ? <Outlet {...rest}/> : <Navigate to="/login"/>
}

export default PrivateRoute