import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import {useOfferData, useThemeSwitch} from '../utils/UseData'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSun, faMoon, faMagnifyingGlass, faHouse, faBars, faComment} from '@fortawesome/free-solid-svg-icons'
import i18n from 'i18next'
import {useTranslation} from 'react-i18next'


export default function Header() {

    const [t] = useTranslation()
    const navigate = useNavigate()
    const {user, logoutUser} = useContext(AuthContext)
    const {handleOfferType} = useOfferData()
    const [searchQuery, setSearchQuery] = useState('')
    const {theme, setTheme, handleThemeSwitch} = useThemeSwitch()
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'pl' : 'en'
        i18n.changeLanguage(newLanguage)
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
        <div className='relative'>
            <div
                className='pt-4 px-4 sm:px-6 md:px-8 md:mb-8 flex items-center justify-between gap-x-4 sm:gap-x-6 md:gap-x-8 leading-6 relative'>
                <ul className='flex whitespace-nowrap w-full md:w-fit lg:w-full'>
                    {user ? (
                        <ul className='flex grow items-center gap-x-4 sm:gap-x-6 md:gap-x-8'>
                            <li>
                                <div className='md:hidden'>
                                    <button
                                        className='btn-1-icon'
                                        onClick={toggleMenu}
                                    >
                                        <FontAwesomeIcon icon={faBars}/>
                                    </button>
                                </div>
                                <Link
                                    className='hidden md:max-xl:flex btn-1-icon'
                                    to={'/'}>
                                    <FontAwesomeIcon icon={faHouse}/>
                                </Link>
                                <Link
                                    className='hidden xl:flex txt-2'
                                    to={'/'}>
                                    StudentOffers
                                </Link>
                            </li>
                            {user && menuOpen && (
                                <button className='md:hidden btn-3' onClick={toggleLanguage}>
                                    {i18n.language === 'en' ? 'EN' : 'PL'}
                                </button>
                            )}
                            <button className='hidden md:flex btn-3' onClick={toggleLanguage}>
                                {i18n.language === 'en' ? 'EN' : 'PL'}
                            </button>
                            <li className='hidden xl:flex txt-8'>
                                {user && <p>{t('header.hello')}, {user.username}</p>}
                            </li>
                            <li className='flex md:max-lg:hidden rounded-full bg-white/70 dark:bg-zinc-700/70 w-full shadow-lg'>
                                <input
                                    className='inp-3 grow'
                                    type='text'
                                    placeholder={t('header.search') + '...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleEnter}>
                                </input>
                                <Link
                                    className='btn-1-icon'
                                    to={`/offer?search=${searchQuery}`}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <li className='flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8'>
                            <Link
                                className='sm:hidden flex btn-1-icon'
                                to={'/'}>
                                <FontAwesomeIcon icon={faHouse}/>
                            </Link>
                            <Link
                                className='hidden sm:flex txt-2'
                                to={'/'}>
                                StudentOffers
                            </Link>
                            <button className='btn-3' onClick={toggleLanguage}>
                                {i18n.language === 'en' ? 'EN' : 'PL'}
                            </button>
                        </li>
                    )}
                </ul>
                {user && (
                    <div
                        className='hidden md:flex items-center w-full lg:w-fit'>
                        <Link
                            onClick={() => handleOfferType('Offer')}
                            className='btn-3'
                            to={'/offer'}>
                            {t('header.offers')}
                        </Link>
                        <div className='lg:border-r lg:pr-8 h-5 border-zinc-700 dark:border-zinc-200'/>
                    </div>
                )}
                {user ? (
                    <ul className='flex whitespace-nowrap items-center gap-x-8'>
                        {user.user_type === 'Company' && (
                            <Link
                                className='hidden md:flex btn-3'
                                to='/offer/new'>
                                {t('header.add_offer')}
                            </Link>
                        )}
                        <Link
                            className='hidden md:flex btn-3'
                            to='/chat'>
                            {t('header.conversations')}
                        </Link>
                        <Link
                            className='hidden btn-1 md:flex items-center'
                            to={'/account'}>
                            {t('header.account')}
                        </Link>
                        <button
                            className='hidden md:flex btn-3'
                            onClick={logoutUser}>
                            {t('button.log_out')}
                        </button>
                        <div className='btn-2-icon'>
                            <button
                                className='hidden md:block'
                                onClick={handleThemeSwitch}>
                                <FontAwesomeIcon
                                    icon={theme === 'dark' ? faMoon : faSun}/>
                            </button>
                            <Link
                                className='md:hidden'
                                to='/chat'>
                                <FontAwesomeIcon icon={faComment}/>
                            </Link>
                        </div>
                    </ul>
                ) : (
                    <ul className='flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8'>
                        <Link
                            className='btn-1 flex items-center'
                            to={'/login'}>
                            {t('button.log_in')}
                        </Link>
                        <button
                            className='btn-2-icon'
                            onClick={handleThemeSwitch}>
                            <FontAwesomeIcon
                                icon={theme === 'dark' ? faMoon : faSun}
                            />
                        </button>
                    </ul>
                )}
            </div>
            <div
                className={`md:hidden pb-8 overflow-hidden transition-max-h duration-300 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                {user && menuOpen && (
                    <div className='con-1 mx-4 sm:mx-6 px-4 sm:px-6 mt-4'>
                        <ul className='flex flex-col w-full items-center'>
                            <Link
                                onClick={toggleMenu}
                                className='btn-6'
                                to='/'>
                                {t('header.home')}
                            </Link>
                            <Link
                                onClick={() => {
                                    handleOfferType('Offer')
                                    toggleMenu()
                                }}
                                className='btn-6'
                                to={'/offer'}>
                                {t('header.offers')}
                            </Link>
                            {user.user_type === 'Company' && (
                                <Link
                                    onClick={toggleMenu}
                                    className='btn-6'
                                    to='/offer/new'>
                                    {t('header.add_offer')}
                                </Link>
                            )}
                            <button
                                onClick={handleThemeSwitch}
                                className='btn-6'>
                                {theme === 'dark' ? t('header.theme_light') : t('header.theme_dark')}
                            </button>
                            <Link
                                onClick={toggleMenu}
                                className='btn-6'
                                to={`/account`}>
                                {t('header.account')}
                            </Link>
                            <button
                                className='btn-6 border-b-0'
                                onClick={() => {
                                    logoutUser()
                                    toggleMenu()
                                }}>
                                {t('button.log_out')}
                            </button>
                        </ul>
                    </div>
                )}
            </div>
            {user && (
                <li className='hidden md:max-lg:flex mb-8 sm:mx-6 md:mx-8 rounded-full bg-white/70 dark:bg-zinc-700/70 shadow-lg'>
                    <input
                        className='inp-3 grow'
                        type='text'
                        placeholder={t('header.search') + '...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleEnter}>
                    </input>
                    <Link
                        className='btn-1-icon'
                        to={`/offer?search=${searchQuery}`}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </Link>
                </li>
            )}
        </div>
    )
}