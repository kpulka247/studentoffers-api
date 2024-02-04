import React, {lazy, Suspense, useEffect, useState} from 'react'
import {useOfferData, useOffersData} from '../utils/UseData'
import {useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";

const ListItem = lazy(() => import('../components/ListItem'))


export default function OffersListPage() {

    const [t] = useTranslation()
    const {offers, jobs, internships, apprenticeships} = useOffersData()
    const {offer, handleOfferType} = useOfferData()
    const [sortOffers, setSortOffers] = useState('desc')

    const location = useLocation()
    const searchQuery = new URLSearchParams(location.search).get('search')

    const handleSortOffersChange = offers => {
        setSortOffers(offers)
    }

    const filterOffers = (items) => {
        if (!searchQuery) {
            return items
        }
        const lowercaseSearchQuery = searchQuery.toLowerCase()
        return items.filter((item) => item.name && item.name.toLowerCase().includes(lowercaseSearchQuery))
    }

    const filteredOffers = filterOffers(offers)
    const filteredJobs = filterOffers(jobs)
    const filteredInternships = filterOffers(internships)
    const filteredApprenticeships = filterOffers(apprenticeships)

    useEffect(() => {
        let offerType = localStorage.getItem('offerType')
        if (!offerType) {
            offerType = 'Offer'
            localStorage.setItem('offerType', offerType)
        }
        handleOfferType(offerType)
    }, [])

    return (
        <section className='w-full max-w-7xl mx-auto focus:outline-none px-4 sm:px-6 md:px-8 relative'>
            <div
                className='hidden md:block lg:flex lg:px-8 justify-between'>
                <div className='justify-center flex gap-x-4 sm:gap-x-6 md:gap-x-8 pb-8 lg:pb-0'>
                    <button
                        onClick={() => handleOfferType('Offer')}
                        className={offer.offer_type === 'Offer' ? ('btn-1') : ('btn-2')}>
                        {t('offer.all')}
                    </button>
                    <button
                        onClick={() => handleOfferType('Job')}
                        className={offer.offer_type === 'Job' ? ('btn-1') : ('btn-2')}>
                        {t('offer.job')}
                    </button>
                    <button
                        onClick={() => handleOfferType('Internship')}
                        className={offer.offer_type === 'Internship' ? ('btn-1') : ('btn-2')}>
                        {t('offer.internship')}
                    </button>
                    <button
                        onClick={() => handleOfferType('Apprenticeship')}
                        className={offer.offer_type === 'Apprenticeship' ? ('btn-1') : ('btn-2')}>
                        {t('offer.apprenticeship')}
                    </button>
                </div>
                <div className='justify-center flex gap-y-4 sm:gap-y-0 gap-x-4 sm:gap-x-6 md:gap-x-8'>
                    <button
                        onClick={() => handleSortOffersChange('desc')}
                        className={sortOffers === 'desc' ? ('btn-1') : ('btn-2')}>
                        {t('offer.newest')}
                    </button>
                    <button
                        onClick={() => handleSortOffersChange('asc')}
                        className={sortOffers === 'asc' ? ('btn-1') : ('btn-2')}>
                        {t('offer.oldest')}
                    </button>
                </div>
            </div>
            <div className='md:hidden flex flex-col gap-y-8'>
                <div className='con-4'>
                    <button
                        onClick={() => handleOfferType('Offer')}
                        className={offer.offer_type === 'Offer' ? ('btn-7') : ('btn-7 text-zinc-400 dark:text-zinc-500')}>
                        {t('offer.all')}
                    </button>
                    <button
                        onClick={() => handleOfferType('Job')}
                        className={offer.offer_type === 'Job' ? ('btn-7') : ('btn-7 text-zinc-400 dark:text-zinc-500')}>
                        {t('offer.job')}
                    </button>
                    <button
                        onClick={() => handleOfferType('Internship')}
                        className={offer.offer_type === 'Internship' ? ('btn-7') : ('btn-7 text-zinc-400 dark:text-zinc-500')}>
                        {t('offer.internship')}
                    </button>
                    <button
                        onClick={() => handleOfferType('Apprenticeship')}
                        className={offer.offer_type === 'Apprenticeship' ? ('btn-7 border-r-0') : ('btn-7 text-zinc-400 dark:text-zinc-500 border-r-0')}>
                        {t('offer.apprenticeship')}
                    </button>
                </div>
                <div className='con-4'>
                    <button
                        onClick={() => handleSortOffersChange('desc')}
                        className={sortOffers === 'desc' ? ('btn-7') : ('btn-7 text-zinc-400 dark:text-zinc-500')}>
                        {t('offer.newest')}
                    </button>
                    <button
                        onClick={() => handleSortOffersChange('asc')}
                        className={sortOffers === 'asc' ? ('btn-7 border-r-0') : ('btn-7 text-zinc-400 dark:text-zinc-500 border-r-0')}>
                        {t('offer.oldest')}
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 relative pt-8 lg:px-8 gap-y-4 sm:gap-y-6 md:gap-y-8 overflow-hidden'>
                <Suspense fallback={
                    <div className='txt-1 animate-spin flex grow justify-center items-center min-h-fit'>
                        <FontAwesomeIcon icon={faCircleNotch}/>
                    </div>
                }>
                    {offer.offer_type === 'Offer' ? (
                        filteredOffers
                            .sort((a, b) => {
                                if (sortOffers === 'desc') {
                                    return b.date - a.date
                                } else {
                                    return a.date - b.date
                                }
                            })
                            .map((offer, index) => (
                                <ListItem
                                    key={index}
                                    offer={offer}
                                />
                            ))
                    ) : offer.offer_type === 'Job' ? (
                        filteredJobs
                            .sort((a, b) => {
                                if (sortOffers === 'desc') {
                                    return b.date - a.date
                                } else {
                                    return a.date - b.date
                                }
                            })
                            .map((job, index) => (
                                <ListItem
                                    key={index}
                                    offer={job}
                                />
                            ))
                    ) : offer.offer_type === 'Internship' ? (
                        filteredInternships
                            .sort((a, b) => {
                                if (sortOffers === 'desc') {
                                    return b.date - a.date
                                } else {
                                    return a.date - b.date
                                }
                            })
                            .map((internship, index) => (
                                <ListItem
                                    key={index}
                                    offer={internship}
                                />
                            ))
                    ) : offer.offer_type === 'Apprenticeship' ? (
                        filteredApprenticeships
                            .sort((a, b) => {
                                if (sortOffers === 'desc') {
                                    return b.date - a.date
                                } else {
                                    return a.date - b.date
                                }
                            })
                            .map((apprenticeship, index) => (
                                <ListItem
                                    key={index}
                                    offer={apprenticeship}
                                />
                            ))
                    ) : (
                        <div className='txt-1 text-center mb-8 relative'>
                            <p>{t('offer.please_select_offers')}</p>
                        </div>
                    )}
                </Suspense>
            </div>
        </section>
    )
}