import React from 'react'
import {useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'


export default function Footer() {

    const [t] = useTranslation()
    const location = useLocation()

    const currentYear = new Date().getFullYear()

    return (
        <>
            <div className={`${location.pathname.startsWith('/chat') ? '' : 'grow'}`}/>
            <div className={`flex justify-center items-center ${location.pathname.startsWith('/chat') ? 'hidden md:block' : ''}`}>
                <p className='txt-10 py-4 text-center'>
                    Copyright © {currentYear} Kamil Pułka. {t('global.copyright')}
                </p>
            </div>
        </>
    )
}