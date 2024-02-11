import React, {lazy, Suspense, useContext, useEffect} from 'react'
import AuthContext from '../context/AuthContext'
import {useOffersData, useUsersData} from '../utils/UseData'
import {useTranslation} from 'react-i18next'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'

const ListMyItem = lazy(() => import('../components/ListMyOffer'))
const ListUser = lazy(() => import('../components/ListUser'))


export default function AccountPage() {

    const [t] = useTranslation()
    const {user} = useContext(AuthContext)
    const {offers, getOffers} = useOffersData()
    const {users, getUsers, deleteUser, updateUser, confirmationDialog} = useUsersData()

    const userOffers = offers
        .filter((offer) => offer.company.id === user.user_id)
        .sort((a, b) => b.date - a.date)
        .map((offer, index) => (
            <ListMyItem
                key={index}
                offer={offer}
            />))

    const adminUsers = users
        .map((user, index) => (
            <ListUser
                key={index}
                user={user}
                userId={user.id}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
            />
        ))

    useEffect(() => {
        if (user.user_type === 'Company') {
            getOffers()
        } else if (user.is_staff) {
            getOffers()
            getUsers()
        }
    }, [user.user_type])

    return (
        <section className='w-full max-w-7xl mx-auto focus:outline-none px-4 sm:px-6 md:px-8 relative'>
            <div className='gap-6 lg:gap-8'>
                <figure
                    className='con-1 txt-9 px-4 sm:px-6 md:px-8'>
                    <div className='sm:flex sm:text-center break-words my-4 sm:my-6 md:my-8'>
                        <div className='sm:w-1/2'>
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
                        <div className='sm:w-1/2'>
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
                                        {user.name}
                                    </p>
                                    {t('account.address')}
                                    <p className='txt-4'>
                                        {user.location}
                                    </p>
                                </>
                            ) : user.user_type === 'Student' ? (
                                <>
                                    {t('account.field_of_study')}
                                    <p className='txt-4 mb-4'>
                                        {user.field_of_study}
                                    </p>
                                    {t('account.student_id_number')}
                                    <p className='txt-4'>
                                        {user.student_id}
                                    </p>
                                </>
                            ) : null}
                        </div>
                    </div>
                </figure>
                {user.user_type === 'Company' ? (
                    <div className='relative mt-8'>
                        {userOffers && userOffers.length > 0 ? (
                            <Suspense fallback={
                                <div className='txt-1 animate-spin flex grow justify-center items-center min-h-fit'>
                                    <FontAwesomeIcon icon={faCircleNotch}/>
                                </div>
                            }>
                                <section className='text-center'>
                                    <h1 className='txt-1'>
                                        {t('account.your_offers')}
                                    </h1>
                                </section>
                                <div className='hidden md:flex gr-1'/>
                                <div
                                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-8 md:pb-8 md:px-8 overflow-hidden'>
                                    {userOffers}
                                </div>
                            </Suspense>
                        ) : (
                            <section className='text-center'>
                                <h1 className='txt-1'>
                                    {t('account.add_offer')}
                                </h1>
                            </section>
                        )}
                    </div>
                ) : null}
                {user.is_staff && (
                    <div className='relative mt-8'>
                        <section className='text-center'>
                            <h1 className='txt-1'>
                                {t('account.admin_panel')}
                            </h1>
                        </section>
                        <div
                            className='con-1 py-8 txt-9 px-4 sm:px-6 md:px-8 mt-8'>
                            <p className='txt-3 text-center pb-8'>
                                {t('account.stats')}
                            </p>
                            <div className='sm:flex w-full sm:text-center break-words'>
                                <div className='sm:w-1/2'>
                                    {t('account.inactive_all')}
                                    <p className='txt-3 mb-4'>
                                        {t('offer.all')}: {users.filter(user => !user.is_active).length} / {users.length}
                                    </p>
                                    <p className='txt-4'>
                                        {t('account.student')}: {users.filter(user => user.user_type === 'Student' && !user.is_active).length} / {users.filter(user => user.user_type === 'Student').length}
                                    </p>
                                    <p className='txt-4'>
                                        {t('account.company')}: {users.filter(user => user.user_type === 'Company' && !user.is_active).length} / {users.filter(user => user.user_type === 'Company').length}
                                    </p>
                                </div>
                                <div className='sm:w-1/2 mt-4 sm:mt-0'>
                                    {t('account.number_of_offers')}
                                    <p className='txt-3 mb-4'>
                                        {t('offer.all')}: {offers.length}
                                    </p>
                                    <p className='txt-4'>
                                        {t('offer.job')}: {offers.filter(offer => offer.offer_type === 'Job').length}
                                    </p>
                                    <p className='txt-4'>
                                        {t('offer.internship')}: {offers.filter(offer => offer.offer_type === 'Internship').length}
                                    </p>
                                    <p className='txt-4'>
                                        {t('offer.apprenticeship')}: {offers.filter(offer => offer.offer_type === 'Apprenticeship').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className='con-1 py-8 txt-9 px-4 sm:px-6 md:px-8 mt-8'>
                            <p className='txt-3 text-center pb-8'>
                                {t('account.user_accounts')}
                            </p>
                            <div className='flex w-full mb-4 justify-around text-center break-words'>
                                <p className='w-3/5 sm:w-2/5 lg:w-1/5 text-start'>
                                    {t('account.username')}
                                </p>
                                <p className='hidden lg:block w-1/5 px-4'>
                                    {t('account.full_name')}
                                </p>
                                <p className='hidden lg:block w-1/5'>
                                    {t('account.email')}
                                </p>
                                <p className='hidden sm:block w-2/5 lg:w-1/5 px-4'>
                                    {t('account.joined')}
                                </p>
                                <p className='w-2/5 sm:w-1/5 text-end'>
                                    {t('account.active')}
                                </p>
                            </div>
                            {adminUsers}
                        </div>
                    </div>
                )}
                {confirmationDialog}
            </div>
        </section>
    )
}