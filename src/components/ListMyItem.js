import React from "react"
import {Link} from "react-router-dom"


const ListMyItem = ({offer}) => {

    return (
        <Link
            className="con-1 w-full h-full self-start transition ease-in-out lg:hover:-translate-y-2 lg:hover:scale-105 py-4 sm:py-6 md:py-8"
            to={`/offer/${offer.id}`}>
            <div className="txt-5 text-center">
                {offer.offer_type === 'Job' ? (
                    <p>Praca</p>
                ) : offer.offer_type === 'Internship' ? (
                    <p>Staż</p>
                ) : offer.offer_type === 'Apprenticeship' ? (
                    <p>Praktyka</p>
                ) : null}
            </div>
            <p className="txt-3 text-center my-4">
                {offer.name}
            </p>
            <p className="txt-6 text-center">
                {offer.offer.length > 100 ? (offer.offer = offer.offer.substring(0, 100) + "...") : offer.offer}
            </p>
            <div className="txt-5 text-center mt-auto">
                {offer.offer_type === 'Job' && offer.job.salary ? (
                    <p className="pt-4">
                        Wynagrodzenie:<br/>{offer.job.salary} zł / mies.
                    </p>
                ) : null}
            </div>
        </Link>
    )
}

export default ListMyItem