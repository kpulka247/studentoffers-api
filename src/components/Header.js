import React, {useContext, useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import AuthContext from "../context/AuthContext"
import {useOfferData, useThemeSwitch} from "../utils/UseData"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSun, faMoon, faMagnifyingGlass, faHouse, faBars} from "@fortawesome/free-solid-svg-icons"


const Header = () => {

    const navigate = useNavigate()
    const {user, logoutUser} = useContext(AuthContext)
    const {handleOfferType} = useOfferData()
    const [searchQuery, setSearchQuery] = useState('')
    const {theme, setTheme, handleThemeSwitch} = useThemeSwitch()
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const handleSearch = () => {
        navigate(`/offer?search=${searchQuery}`)
    }

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <div className="relative">
            <div
                className="pt-4 px-4 sm:px-6 md:px-8 md:mb-8 flex items-center justify-between gap-x-4 sm:gap-x-6 md:gap-x-8 leading-6 relative">
                <ul className="flex whitespace-nowrap w-full md:w-fit lg:w-full">
                    {user ? (
                        <ul className="flex grow items-center gap-x-4 sm:gap-x-6 md:gap-x-8">
                            <li>
                                <div className="md:hidden">
                                    <button
                                        className="btn-1-icon"
                                        onClick={toggleMenu}
                                    >
                                        <FontAwesomeIcon icon={faBars}/>
                                    </button>
                                </div>
                                <Link
                                    className="hidden md:max-xl:flex btn-1-icon"
                                    to={`/`}>
                                    <FontAwesomeIcon icon={faHouse}/>
                                </Link>
                                <Link
                                    className="hidden xl:flex txt-2"
                                    to={`/`}>
                                    StudentOffers
                                </Link>
                            </li>
                            <li className="hidden xl:flex txt-8">
                                {user && <p>Witaj, {user.username}</p>}
                            </li>
                            <li className="flex md:max-lg:hidden rounded-full bg-white dark:bg-zinc-700 w-full shadow-lg">
                                <input
                                    className="inp-3 grow"
                                    type="text"
                                    placeholder="Szukaj..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleEnter}>
                                </input>
                                <Link
                                    className="btn-1-icon"
                                    to={`/offer?search=${searchQuery}`}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <li>
                            <Link
                                className="sm:hidden flex btn-1-icon"
                                to={`/`}>
                                <FontAwesomeIcon icon={faHouse}/>
                            </Link>
                            <Link
                                className="hidden sm:flex txt-2"
                                to={`/`}>
                                StudentOffers
                            </Link>
                        </li>
                    )}
                </ul>
                {user && (
                    <div
                        className="hidden md:flex lg:pr-8 w-full lg:w-fit lg:border-r border-zinc-500 dark:border-white">
                        <Link
                            onClick={() => handleOfferType('Offer')}
                            className="btn-3"
                            to={"/offer"}>
                            Oferty
                        </Link>
                    </div>
                )}
                {user ? (
                    <ul className="flex whitespace-nowrap items-center gap-x-8">
                        {user.user_type === 'Company' && (
                            <Link
                                className="hidden md:flex btn-3"
                                to="/offer/new">
                                Dodaj ofertę
                            </Link>
                        )}
                        <Link
                            className="hidden md:flex btn-3"
                            to="/chat">
                            Konwersacje
                        </Link>
                        <Link
                            className="hidden btn-1 md:flex items-center"
                            to={`/account`}>
                            Konto
                        </Link>
                        <button
                            className="hidden md:flex btn-3"
                            onClick={logoutUser}>
                            Wyloguj
                        </button>
                        <button
                            className="btn-2-icon"
                            onClick={handleThemeSwitch}>
                            <FontAwesomeIcon
                                icon={theme === "dark" ? faMoon : faSun}
                            />
                        </button>
                    </ul>
                ) : (
                    <ul className="flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8">
                        <Link
                            className="btn-1 flex items-center"
                            to={"/login"}>
                            Zaloguj się
                        </Link>
                        <button
                            className="btn-2-icon"
                            onClick={handleThemeSwitch}>
                            <FontAwesomeIcon
                                icon={theme === "dark" ? faMoon : faSun}
                            />
                        </button>
                    </ul>
                )}
            </div>
            <div
                className={`md:hidden pb-8 overflow-hidden transition-max-h duration-300 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                {user && menuOpen && (
                    <div className="con-1 mx-4 sm:mx-6 px-4 sm:px-6 mt-4">
                        <ul className="flex flex-col w-full items-center">
                            <Link
                                onClick={toggleMenu}
                                className="btn-6"
                                to="/">
                                Strona główna
                            </Link>
                            <Link
                                onClick={() => {
                                    handleOfferType('Offer')
                                    toggleMenu()
                                }}
                                className="btn-6"
                                to={"/offer"}>
                                Oferty
                            </Link>
                            {user.user_type === 'Company' && (
                                <Link
                                    onClick={toggleMenu}
                                    className="btn-6"
                                    to="/offer/new">
                                    Dodaj ofertę
                                </Link>
                            )}
                            <Link
                                onClick={toggleMenu}
                                className="btn-6"
                                to="/chat">
                                Konwersacje
                            </Link>
                            <Link
                                onClick={toggleMenu}
                                className="btn-6"
                                to={`/account`}>
                                Konto
                            </Link>
                            <button
                                className="btn-6 border-b-0"
                                onClick={() => {
                                    logoutUser()
                                    toggleMenu()
                                }}>
                                Wyloguj
                            </button>
                        </ul>
                    </div>
                )}

            </div>
            {user && (
                <li className="hidden md:max-lg:flex mb-8 sm:mx-6 md:mx-8 rounded-full bg-white dark:bg-zinc-700 shadow-lg">
                    <input
                        className="inp-3 grow"
                        type="text"
                        placeholder="Wyszukaj..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleEnter}>
                    </input>
                    <Link
                        className="btn-1-icon"
                        to={`/offer?search=${searchQuery}`}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </Link>
                </li>
            )}
        </div>
    )
}

export default Header
