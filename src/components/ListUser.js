import React, {useState} from 'react'
import {format} from 'date-fns'
import {faCheck, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTranslation} from 'react-i18next'


const ListUser = ({user, userId, onDeleteUser, onUpdateUser}) => {

    const [t] = useTranslation()
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const getDate = (user) => {
        return format(new Date(user.date_joined), 'dd/MM/yyyy')
    }

    const getRecentDate = (user) => {
        return format(new Date(user.last_login), 'dd/MM/yyyy H:m:s')
    }

    return (
        <>
            <div className={`btn-9 break-words ${menuOpen ? 'bg-zinc-100 dark:bg-zinc-700' : ''}`}>
                <button className='w-3/5 sm:w-2/5 lg:w-1/5 flex items-center'
                        onClick={toggleMenu}>
                    <p className='txt-10 pr-4'>
                        {user.id}
                    </p>
                    <p className='txt-6'>
                        {user.username}
                    </p>
                </button>
                <p className='hidden lg:block w-1/5 txt-6 text-center px-4'>
                    {user.first_name} {user.last_name}
                </p>
                <p className='hidden lg:block w-1/5 txt-6 text-center'>
                    {user.email}
                </p>
                <p className='hidden sm:block w-2/5 lg:w-1/5 txt-10 text-center px-4'>
                    {getDate(user)}
                </p>
                <div className='w-2/5 sm:w-1/5 flex justify-end'>
                    <button className={user.is_active ? 'btn-1-icon' : 'btn-2-icon'}
                            onClick={() => {
                                onUpdateUser(user)
                            }}>
                        {user.is_active ? (
                            <FontAwesomeIcon icon={faCheck}/>
                        ) : (
                            <FontAwesomeIcon icon={faXmark}/>
                        )}
                    </button>
                </div>
            </div>
            <div
                className={`overflow-hidden transition-max-h duration-300 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                {menuOpen && (
                    <div className='con-1 bg-zinc-200 dark:bg-zinc-600'>
                        <div className='sm:flex sm:text-center break-words my-4 sm:my-6 md:my-8'>
                            <div className='sm:w-1/3'>
                                <p className='txt-3 text-center mb-8'>
                                    {t('account.account_details')}
                                </p>
                                {t('account.username')}
                                <p className='txt-4 mb-4'>
                                    {user.username}
                                </p>
                                {t('account.email')}
                                <p className='txt-4 mb-4'>
                                    {user.email}
                                </p>

                                {user.user_type === 'Company' ? (
                                    <>
                                        {t('account.account_type')}
                                        <p className='txt-4'>
                                            {t('account.company')}
                                        </p>
                                    </>
                                ) : user.user_type === 'Student' ? (
                                    <>
                                        {t('account.account_type')}
                                        <p className='txt-4'>
                                            {t('account.student')}
                                        </p>
                                    </>
                                ) : user.is_staff ? (
                                    <>
                                        {t('account.account_type')}
                                        <p className='txt-4'>
                                            {t('account.admin')}
                                        </p>
                                    </>
                                ) : null}
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='txt-3 text-center mb-8 mt-8 sm:mt-0'>
                                    {t('account.personal_details')}
                                </p>
                                {t('account.full_name')}
                                <p className='txt-4 mb-4'>
                                    {user.first_name} {user.last_name}
                                </p>
                                {user.user_type === 'Company' ? (
                                    <>
                                        {t('account.company_name')}
                                        <p className='txt-4 mb-4'>
                                            {user.company.name}
                                        </p>
                                        {t('account.address')}
                                        <p className='txt-4'>
                                            {user.company.location}
                                        </p>
                                    </>
                                ) : user.user_type === 'Student' ? (
                                    <>
                                        {t('account.field_of_study')}
                                        <p className='txt-4 mb-4'>
                                            {user.student.field_of_study}
                                        </p>
                                        {t('account.student_id_number')}
                                        <p className='txt-4'>
                                            {user.student.student_id}
                                        </p>
                                    </>
                                ) : null}
                            </div>
                            <div className='sm:w-1/3'>
                                <p className='txt-3 text-center mb-8 mt-8 sm:mt-0'>
                                    {t('account.additional_data')}
                                </p>
                                {t('account.joined')}
                                <p className='txt-4 mb-4'>
                                    {getDate(user)}
                                </p>
                                {t('account.status')}
                                <p className='txt-4 mb-4'>
                                    {user.is_active ? (
                                        t('account.active')
                                    ) : t('account.inactive')}
                                </p>
                                {t('account.recent_activity')}
                                <p className='txt-4'>
                                    {user.last_login ? (
                                        getRecentDate(user)
                                    ) : t('account.no_data')}
                                </p>
                            </div>
                        </div>
                        <div className='mb-8 flex justify-center'>
                            <button className='btn-1'
                                    onClick={() => {
                                        onDeleteUser(userId, user.username)
                                    }}>
                                {t('button.delete')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ListUser