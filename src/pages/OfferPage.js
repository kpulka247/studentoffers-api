import React, {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import {useChatData, useOfferData} from "../utils/UseData"
import AuthContext from "../context/AuthContext"


const OfferPage = () => {

    const offerId = useParams().id
    const {user} = useContext(AuthContext)

    const {createChat} = useChatData()
    const {offer, setOffer, getOffer, handleOfferSubmit, handleOfferType, deleteOffer, confirmationDialog} = useOfferData()

    useEffect(() => {
        if (offerId === 'new') {
            setOffer({company: user.user_id, offer_type: null})
        }
        getOffer(offerId)
    }, [user, offerId])

    return (
        <section className="w-full max-w-7xl mx-auto focus:outline-none px-4 sm:px-6 md:px-8 relative">
            {offerId === 'new' && user.user_type === 'Company' && (
                <div>
                    {offer.offer_type === null ? (
                        <div className="txt-1 text-center mb-8">
                            <p>Wybierz typ oferty</p>
                        </div>
                    ) : (
                        <p className="txt-1 text-center mb-8">
                            Dodawanie oferty
                        </p>
                    )}
                    <div className="hidden md:block lg:flex justify-center">
                        <div className="mb-8 flex justify-center gap-x-8">
                            <button
                                onClick={() => handleOfferType('Job')}
                                className={offer.offer_type === 'Job' ? ("btn-1") : ("btn-2")}>
                                Praca
                            </button>
                            <button
                                onClick={() => handleOfferType('Internship')}
                                className={offer.offer_type === 'Internship' ? ("btn-1") : ("btn-2")}>
                                Staż
                            </button>
                            <button
                                onClick={() => handleOfferType('Apprenticeship')}
                                className={offer.offer_type === 'Apprenticeship' ? ("btn-1") : ("btn-2")}>
                                Praktyka
                            </button>
                        </div>
                    </div>
                    <div className="md:hidden con-4 flex mb-8">
                        <button
                            onClick={() => handleOfferType('Job')}
                            className={offer.offer_type === 'Job' ? ("btn-7") : ("btn-7 text-zinc-400 dark:text-zinc-500")}>
                            Praca
                        </button>
                        <button
                            onClick={() => handleOfferType('Internship')}
                            className={offer.offer_type === 'Internship' ? ("btn-7") : ("btn-7 text-zinc-400 dark:text-zinc-500")}>
                            Staż
                        </button>
                        <button
                            onClick={() => handleOfferType('Apprenticeship')}
                            className={offer.offer_type === 'Apprenticeship' ? ("btn-7 border-r-0") : ("btn-7 text-zinc-400 dark:text-zinc-500 border-r-0")}>
                            Praktyka
                        </button>
                    </div>
                </div>
            )}
            {offer.offer_type && offer.company.id === user.user_id || offer.offer_type && offerId === 'new' ? (
                <div className="relative gap-6 lg:gap-8">
                    <figure
                        className="con-1 txt-9 px-4 sm:px-6 md:px-8">
                        <div
                            className="txt-1 text-center my-8">
                            {offer.company.name}
                        </div>
                        <p className="pb-2">Tytuł oferty</p>
                        <input
                            className="inp-1 mb-8"
                            type="text"
                            maxLength={100}
                            onChange={(e) => {
                                setOffer({
                                    ...offer,
                                    'name': e.target.value
                                })
                            }}
                            defaultValue={offer?.name}
                        />
                        <p className="pb-2">Czego wymagamy?</p>
                        <textarea
                            className="inp-1 mb-8"
                            rows={6}
                            onChange={(e) => {
                                setOffer({
                                    ...offer,
                                    'requirements': e.target.value
                                })
                            }}
                            defaultValue={offer?.requirements}
                        />
                        <p className="pb-2">Nasza oferta</p>
                        <textarea
                            className="inp-1 mb-8"
                            rows={6}
                            onChange={(e) => {
                                setOffer({
                                    ...offer,
                                    'offer': e.target.value
                                })
                            }}
                            defaultValue={offer?.offer}
                        />
                        {offer.offer_type === 'Job' && (
                            <>
                                <p className="pb-2">Wynagrodzenie (zł / mies.)</p>
                                <input
                                    className="inp-1 mb-8"
                                    type="text"
                                    maxLength={10}
                                    onChange={(e) => {
                                        setOffer({
                                            ...offer,
                                            job: {
                                                ...offer.job,
                                                salary: e.target.value
                                            }
                                        })
                                    }}
                                    defaultValue={offer?.job?.salary}
                                />
                                <p className="pb-2">Rodzaj zatrudnienia</p>
                                <input
                                    className="inp-1 mb-8"
                                    type="text"
                                    maxLength={50}
                                    onChange={(e) => {
                                        setOffer({
                                            ...offer,
                                            job: {
                                                ...offer.job,
                                                employment_type: e.target.value
                                            }
                                        })
                                    }}
                                    defaultValue={offer?.job?.employment_type}
                                />
                            </>
                        )}
                        {offer.offer_type === 'Internship' && (
                            <>
                                <p className="pb-2">Wysokość stypendium (zł)</p>
                                <input
                                    className="inp-1 mb-8"
                                    type="text"
                                    maxLength={10}
                                    onChange={(e) => {
                                        setOffer({
                                            ...offer,
                                            internship: {
                                                ...offer.internship,
                                                stipend: e.target.value
                                            }
                                        })
                                    }}
                                    defaultValue={offer?.internship?.stipend}
                                />
                                <p className="pb-2">Zaliczający się na uczelni?</p>
                                <select
                                    className="inp-1 mb-8"
                                    onChange={(e) => {
                                        setOffer({
                                            ...offer,
                                            internship: {
                                                ...offer.internship,
                                                academic_credit: e.target.value === "Tak"
                                            }
                                        })
                                    }}
                                    defaultValue={offer && offer.internship && offer.internship.academic_credit !== undefined ?
                                        (offer.internship.academic_credit ? "Nie" : "Tak") : "Nie"}>
                                    <option value="Nie">Nie</option>
                                    <option value="Tak">Tak</option>
                                </select>
                            </>
                        )}
                        {offerId !== 'new' ? (
                            <div
                                className="mb-8 flex justify-center gap-x-4 sm:gap-x-6 md:gap-x-8">
                                <button
                                    onClick={handleOfferSubmit}
                                    className="btn-1">
                                    Potwierdź
                                </button>
                                <button
                                    onClick={deleteOffer}
                                    className="btn-2">
                                    Usuń ofertę
                                </button>
                            </div>
                        ) : (
                            <div className="mb-8 flex justify-center gap-x-8">
                                <button
                                    onClick={handleOfferSubmit}
                                    className="btn-1">
                                    Potwierdź
                                </button>
                            </div>
                        )}
                    </figure>
                </div>
            ) : null}
            {offer.offer_type && offer.company.id !== user.user_id && offerId !== 'new' ? (
                <div className="relative gap-6 lg:gap-8">
                    <div
                        className="txt-1 text-center mb-8 relative">
                        {offer.offer_type === 'Job' ? (
                            <p>Praca</p>
                        ) : offer.offer_type === 'Internship' ? (
                            <p>Staż</p>
                        ) : offer.offer_type === 'Apprenticeship' ? (
                            <p>Praktyka</p>
                        ) : null}
                    </div>
                    <figure
                        className="con-1 txt-9">
                        <div
                            className="txt-1 text-center my-8 relative">
                            {offer.company.name}
                        </div>
                        <p
                            className="txt-4 text-center pb-8 border-b border-zinc-200 dark:border-zinc-600 relative">
                            {offer.company.description.length > 250 ? (
                                offer.company.description = offer.company.description.substring(0, 250) + "..."
                            ) : offer.company.description}
                        </p>
                        <p className="pt-8 pb-2">Tytuł oferty</p>
                        <div
                            className="con-3 txt-2 mb-8">
                            {offer.name}
                        </div>
                        <p className="text-2xl pb-2">Czego wymagamy?</p>
                        <p
                            className="con-3 txt-4 whitespace-pre-wrap mb-8">
                            {offer.requirements}
                        </p>
                        <p className="text-2xl pb-2">Nasza oferta</p>
                        <p
                            className="con-3 txt-4 whitespace-pre-wrap mb-8">
                            {offer.offer}
                        </p>
                        {offer.offer_type === 'Job' && (
                            <>
                                <p className="pb-2">Wynagrodzenie</p>
                                <div
                                    className="con-3 txt-4 mb-8">
                                    {offer.job.salary} zł / mies.
                                </div>
                                <p className="pb-2">Rodzaj zatrudnienia</p>
                                <div
                                    className="con-3 txt-4 mb-8">
                                    {offer.job.employment_type}
                                </div>
                            </>
                        )}
                        {offer.offer_type === 'Internship' && (
                            <>
                                <p className="pb-2">Wysokość stypendium</p>
                                <div
                                    className="con-3 txt-4 mb-8">
                                    {offer.internship.stipend} zł
                                </div>
                                <p className="pb-2">Zaliczający się na uczelni?</p>
                                <div
                                    className="con-3 txt-4 mb-8">
                                    {offer.internship.academic_credit === true ? (
                                        <p>Tak</p>
                                    ) : (
                                        <p>Nie</p>
                                    )}
                                </div>
                            </>
                        )}
                        {offer.offer_type !== null && (
                            <div
                                className="mb-8 flex justify-center">
                                <button
                                    onClick={createChat}
                                    className="btn-1">
                                    Skontaktuj się
                                </button>
                            </div>
                        )}
                    </figure>
                </div>
            ) : null}
            {confirmationDialog}
        </section>
    )
}

export default OfferPage
