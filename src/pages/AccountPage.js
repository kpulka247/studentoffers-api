import React, {useContext} from "react"
import AuthContext from "../context/AuthContext"
import {useOffersData} from "../utils/UseData"
import ListMyItem from "../components/ListMyItem"


const AccountPage = () => {

    let {user} = useContext(AuthContext)
    let {offers} = useOffersData()

    const userOffers = offers
        .filter((offer) => offer.company.id === user.user_id)
        .sort((a, b) => b.date - a.date)
        .map((offer, index) => (
            <ListMyItem
                key={index}
                offer={offer}
            />))

    return (
        <section className="w-full max-w-7xl mx-auto focus:outline-none px-4 sm:px-6 md:px-8 relative">
            <div className="gap-6 lg:gap-8">
                <figure
                    className="con-1 txt-9 px-4 sm:px-6 md:px-8">
                    <div className="sm:flex sm:text-center justify-around my-4 sm:my-6 md:my-8">
                        <div className="">
                            <p className="txt-3 flex justify-around mb-8">
                                Dane konta
                            </p>
                            Nazwa użytkownika
                            <div className="txt-4 mb-4">
                                {user.username}
                            </div>
                            Email
                            <div className="txt-4 mb-4">
                                {user.email}
                            </div>

                            {user.user_type === 'Company' ? (
                                <>
                                    Typ konta
                                    <div className="txt-4">
                                        <p>Firma</p>
                                    </div>
                                </>
                            ) : user.user_type === 'Student' ? (
                                <>
                                    Typ konta
                                    <div className="txt-4">
                                        <p>Student</p>
                                    </div>
                                </>
                            ) : null}
                        </div>
                        <div>
                            <p className="txt-3 flex justify-around mb-8 mt-8 sm:mt-0">
                                Dane personalne
                            </p>
                            Imię i nazwisko
                            <div className="txt-4 mb-4">
                                {user.first_name} {user.last_name}
                            </div>
                            {user.user_type === 'Company' ? (
                                <>
                                    Nazwa firmy
                                    <div className="txt-4 mb-4">
                                        {user.name}
                                    </div>
                                    Adres
                                    <div className="txt-4">
                                        {user.location}
                                    </div>
                                </>
                            ) : user.user_type === 'Student' ? (
                                <>
                                    Kierunek studiów
                                    <div className="txt-4 mb-4">
                                        {user.field_of_study}
                                    </div>
                                    Numer legitymacji studenckiej
                                    <div className="txt-4">
                                        {user.student_id}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </figure>
                {user.user_type === 'Company' ? (
                    <div className="relative">
                        <section className="text-center">
                            <h1 className="txt-1 mt-8">
                                Twoje oferty
                            </h1>
                        </section>
                        <div className="hidden md:flex gr-1"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-8 md:pb-8 md:px-8 overflow-hidden">
                            {userOffers}
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    )
}

export default AccountPage