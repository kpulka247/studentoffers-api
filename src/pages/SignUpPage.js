import React from 'react'
import {usePasswordToggle, useUserData} from '../utils/UseData'
import {useTranslation} from 'react-i18next'


export default function SignUpPage() {

    const [t] = useTranslation()
    const {user, setUser, handleUserSubmit, handleUserType} = useUserData()
    const [toggleIcon, passwordInputType] = usePasswordToggle()

    return (
        <section className='w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 relative'>
            <div className='gap-6 lg:gap-8'>
                <div
                    className='con-1 txt-3 text-center'>
                    <p className='my-8'>{t('signup.select_account_type')}</p>
                    <div
                        className='inset-x-0 bottom-0 flex justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 mb-8'>
                        <button
                            onClick={() => handleUserType('Student')}
                            className={user.user_type === 'Student' ? ('btn-1') : ('btn-2')}>
                            {t('account.student')}
                        </button>
                        <button
                            onClick={() => handleUserType('Company')}
                            className={user.user_type === 'Company' ? ('btn-1') : ('btn-2')}>
                            {t('account.company')}
                        </button>
                    </div>
                </div>
            </div>
            {user.user_type && (
                <div className='gap-6 mt-8 lg:gap-8'>
                    <figure
                        className='con-1 txt-9 px-4 sm:px-6 md:px-8'>
                        <p className='txt-3 text-center my-8'>
                            {t('signup.fill_in_details')}
                        </p>
                        <div className='relative'>
                            <input
                                className='inp-1 peer w-full mb-8'
                                type='text'
                                name='username'
                                maxLength={20}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'username': e.target.value
                                    })
                                }}
                                defaultValue={user?.username}
                                placeholder='username'
                            />
                            <label className='lb-1'>
                                {t('account.username')}
                            </label>
                        </div>
                        <div className='relative'>
                            <div
                                className='flex rounded-lg border-b border-zinc-200 dark:border-zinc-600 focus-within:transition focus-within:border-zinc-400 dark:focus-within:border-zinc-400 w-full mb-8'>
                                <input
                                    className='inp-1-nb peer grow'
                                    type={passwordInputType}
                                    maxLength={30}
                                    onChange={(e) => {
                                        setUser({
                                            ...user,
                                            'password': e.target.value
                                        })
                                    }}
                                    defaultValue={user?.password}
                                    placeholder='password'
                                />
                                <label className='lb-1'>
                                    {t('account.password')}
                                </label>
                                <span className='txt-9 flex flex-col place-content-center place-items-end px-4'>
                                {toggleIcon}
                            </span>
                            </div>
                        </div>
                        <div className='relative'>
                            <input
                                className='inp-1 peer w-full mb-8'
                                maxLength={30}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'email': e.target.value
                                    })
                                }}
                                defaultValue={user?.email}
                                placeholder='email'
                            />
                            <label className='lb-1'>
                                {t('account.email')}
                            </label>
                        </div>
                        <div className='relative'>
                            <input
                                className='inp-1 peer w-full mb-8'
                                maxLength={30}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'first_name': e.target.value
                                    })
                                }}
                                defaultValue={user?.first_name}
                                placeholder='first_name'
                            />
                            <label className='lb-1'>
                                {t('account.first_name')}
                            </label>
                        </div>
                        <div className='relative'>
                            <input
                                className='inp-1 peer w-full mb-8'
                                maxLength={30}
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'last_name': e.target.value
                                    })
                                }}
                                defaultValue={user?.last_name}
                                placeholder='last_name'
                            />
                            <label className='lb-1'>
                                {t('account.last_name')}
                            </label>
                        </div>
                        {user.user_type === 'Student' ? (
                            <>
                                <div className='relative'>
                                    <input
                                        className='inp-1 peer w-full mb-8'
                                        type='text'
                                        maxLength={100}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                student: {
                                                    ...user.student,
                                                    field_of_study: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.student?.field_of_study}
                                        placeholder='field_of_study'
                                    />
                                    <label className='lb-1'>
                                        {t('account.field_of_study')}
                                    </label>
                                </div>
                                <div className='relative'>
                                    <input
                                        className='inp-1 peer w-full mb-8'
                                        type='text'
                                        maxLength={20}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                student: {
                                                    ...user.student,
                                                    student_id: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.student?.student_id}
                                        placeholder='student_id'
                                    />
                                    <label className='lb-1'>
                                        {t('account.student_id_number')}
                                    </label>
                                </div>
                            </>
                        ) : user.user_type === 'Company' ? (
                            <>
                                <div className='relative'>
                                    <input
                                        className='inp-1 peer w-full mb-8'
                                        type='text'
                                        maxLength={100}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                company: {
                                                    ...user.company,
                                                    name: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.company?.name}
                                        placeholder='company_name'
                                    />
                                    <label className='lb-1'>
                                        {t('account.company_name')}
                                    </label>
                                </div>
                                <div className='relative'>
                                    <input
                                        className='inp-1 peer w-full mb-8'
                                        type='text'
                                        maxLength={800}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                company: {
                                                    ...user.company,
                                                    description: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.company?.description}
                                        placeholder='company_description'
                                    />
                                    <label className='lb-1'>
                                        {t('account.company_description')}
                                    </label>
                                </div>
                                <div className='relative'>
                                    <input
                                        className='inp-1 peer w-full mb-8'
                                        type='text'
                                        maxLength={150}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                company: {
                                                    ...user.company,
                                                    location: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.company?.location}
                                        placeholder='company_location'
                                    />
                                    <label className='lb-1'>
                                        {t('account.address')}
                                    </label>
                                </div>
                            </>
                        ) : null}
                        <div
                            className='mb-8 flex justify-center'>
                            <button
                                onClick={handleUserSubmit}
                                className='btn-1'>
                                {t('button.confirm')}
                            </button>
                        </div>
                    </figure>
                </div>
            )}

        </section>

    )
}