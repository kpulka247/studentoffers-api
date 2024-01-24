import React from "react"
import {HashRouter as Router, Routes, Route} from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoute"
import {AuthProvider} from "./context/AuthContext"

import "./styles/main.css"
import "./tailwind.css"
import Header from "./components/Header"
import LogPage from "./pages/LogPage"
import RegPage from "./pages/RegPage"
import HomePage from "./pages/HomePage"
import OfferPage from "./pages/OfferPage"
import OffersListPage from "./pages/OffersListPage"
import AccountPage from "./pages/AccountPage"
import MessagesPage from "./pages/MessagesPage"


function App() {

    return (
        <div className="min-h-screen max-h-fit antialiased flex flex-col bg-zinc-100 dark:bg-zinc-800 pb-4 overflow-hidden relative">
            <div className="an-1 top-1/4 left-2/4"/>
            <div className="an-1 bottom-3/4 right-1/4 animation-delay-2000"/>
            <div className="an-2 bottom-2/3 left-1/2 animation-delay-4000"/>
            <div className="an-2 bottom-1/4 left-1/4 animation-delay-6000"/>
            <div className="an-1 top-2/4 right-2/4"/>
            <div className="an-1 top-1/3 left-1/4 animation-delay-2000"/>
            <div className="an-1 top-1/2 right-1/4 animation-delay-6000"/>
            <div className="an-2 bottom-0 right-1/3 animation-delay-4000"/>
            <div className="an-1 bottom-0 right-1/2 animation-delay-2000"/>
            <Router>
                <AuthProvider>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<PrivateRoute/>}>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/account" element={<AccountPage/>}/>
                            <Route path="/chat" element={<MessagesPage/>}/>
                            <Route path="/chat/:id" element={<MessagesPage/>}/>
                            <Route path="/offer" element={<OffersListPage/>}/>
                            <Route path="/offer/:id" element={<OfferPage/>}/>
                        </Route>
                        <Route path="/login" element={<LogPage/>}/>
                        <Route path="/register" element={<RegPage/>}/>
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    )
}

export default App
