import React, {lazy, Suspense} from "react"
import {Link} from "react-router-dom"
import {useOfferData, useOffersData, useWindowSize} from "../utils/UseData"
import {useTranslation} from "react-i18next"

const ListItem = lazy(() => import("../components/ListItem"))


export default function HomePage() {

    const [t] = useTranslation()
    const {jobs, internships, apprenticeships} = useOffersData()
    const {handleOfferType} = useOfferData()
    const visibleOffers = useWindowSize()

    return (
        <section className="w-full max-w-7xl mx-auto focus:outline-none px-4 sm:px-6 md:px-8">
            <Suspense fallback={
                <div className="txt-1 flex justify-center items-center">
                    . . .
                </div>
            }>
                <div className="relative">
                    <section className="text-center">
                        <h1 className="txt-1">
                            {t("offer.job")}
                        </h1>
                    </section>
                    <div
                        className="gr-1">
                        <Link to={`/offer`}>
                            <button
                                onClick={() => handleOfferType('Job')}
                                className="btn-1 mb-4 sm:mb-6 md:mb-8">
                                {t("button.show_more")}
                            </button>
                        </Link>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 pt-8 px-4 sm:px-6 md:px-8 pb-20 sm:pb-24 md:pb-28 overflow-hidden">
                        {jobs
                            .sort((a, b) => b.date - a.date)
                            .slice(0, visibleOffers)
                            .map((job, index) => (
                                <ListItem
                                    key={index}
                                    offer={job}
                                />
                            ))}
                    </div>
                </div>
                <div className="relative my-8">
                    <section className="text-center">
                        <h1 className="txt-1">
                            {t("offer.internship")}
                        </h1>
                    </section>
                    <div
                        className="gr-1">
                        <Link to={`/offer`}>
                            <button
                                onClick={() => handleOfferType('Internship')}
                                className="btn-1 mb-4 sm:mb-6 md:mb-8">
                                {t("button.show_more")}
                            </button>
                        </Link>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 pt-8 px-4 sm:px-6 md:px-8 pb-20 sm:pb-24 md:pb-28 overflow-hidden">
                        {internships
                            .sort((a, b) => b.date - a.date)
                            .slice(0, visibleOffers)
                            .map((internship, index) => (
                                <ListItem
                                    key={index}
                                    offer={internship}
                                />
                            ))}
                    </div>
                </div>
                <div className="relative">
                    <section className="text-center">
                        <h1 className="txt-1">
                            {t("offer.apprenticeship")}
                        </h1>
                    </section>
                    <div
                        className="gr-1">
                        <Link to={`/offer`}>
                            <button
                                onClick={() => handleOfferType('Apprenticeship')}
                                className="btn-1 mb-4 sm:mb-6 md:mb-8">
                                {t("button.show_more")}
                            </button>
                        </Link>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-8 pt-8 px-4 sm:px-6 md:px-8 pb-20 sm:pb-24 md:pb-28 overflow-hidden">
                        {apprenticeships
                            .sort((a, b) => b.date - a.date)
                            .slice(0, visibleOffers)
                            .map((apprenticeship, index) => (
                                <ListItem
                                    key={index}
                                    offer={apprenticeship}
                                />
                            ))}
                    </div>
                </div>
            </Suspense>
        </section>
    )
}