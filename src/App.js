import React, {lazy, Suspense} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import {AuthProvider} from './context/AuthContext'

import './styles/main.css'
import './tailwind.css'
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Header = lazy(() => import('./components/Header'))
const LogInPage = lazy(() => import('./pages/LogInPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const OfferPage = lazy(() => import('./pages/OfferPage'))
const OffersListPage = lazy(() => import('./pages/OffersListPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const Footer = lazy(() => import('./components/Footer'))


export default function App() {

    return (
        <div
            className='min-h-screen max-h-fit antialiased flex flex-col bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative'>
            <div className='an-1 top-1/4 left-2/4'/>
            <div className='an-1 bottom-3/4 right-1/4'/>
            <div className='an-2 bottom-2/3 left-1/2'/>
            <div className='an-2 bottom-1/4 left-1/4'/>
            <div className='an-1 top-2/4 right-2/4'/>
            <div className='an-1 top-1/3 left-1/4'/>
            <div className='an-1 top-1/2 right-1/4'/>
            <div className='an-2 bottom-0 right-1/3'/>
            <div className='an-1 bottom-0 right-1/2'/>
            <Router>
                <AuthProvider>
                    <Header/>
                    <Suspense fallback={
                        <div className='txt-1 animate-spin flex grow justify-center items-center min-h-fit'>
                            <FontAwesomeIcon icon={faCircleNotch}/>
                        </div>
                    }>
                        <Routes>
                            <Route path='/' element={<PrivateRoute/>}>
                                <Route path='/' element={<HomePage/>}/>
                                <Route path='/account' element={<AccountPage/>}/>
                                <Route path='/chat' element={<MessagesPage/>}/>
                                <Route path='/chat/:id' element={<MessagesPage/>}/>
                                <Route path='/offer' element={<OffersListPage/>}/>
                                <Route path='/offer/:id' element={<OfferPage/>}/>
                            </Route>
                            <Route path='/login' element={<LogInPage/>}/>
                            <Route path='/signup' element={<SignUpPage/>}/>
                        </Routes>
                    </Suspense>
                    <Footer/>
                </AuthProvider>
            </Router>
        </div>
    )
}