import React from 'react'
import {Redirect} from 'react-router-dom'

const ProtectedRoute = (props) => {

    const Component = props.component;
    const isAuthenticated = localStorage.getItem('auth-token');

    return isAuthenticated ? (
        <Component />
    ) : (
        <Redirect to={{pathname: '/auth'}}/>
    )
}
export default ProtectedRoute