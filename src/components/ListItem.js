import React from "react"
import {Link} from "react-router-dom"
import {format} from "date-fns"


const ListItem = ({offer}) => {

    const getTime = (offer) => {
        return format(new Date(offer.updated_at), 'dd/MM/yyyy')
    }

    return (
        <Link
            className="con-1 w-full h-full self-start transition ease-in-out lg:hover:-translate-y-2 lg:hover:scale-105 py-4 sm:py-6 md:py-8"
            to={`/offer/${offer.id}`}>
            <div className="flex justify-between">
                <p className="txt-5">
                    {offer.company.name}
                </p>
                <p className="txt-10">
                    {getTime(offer)}
                </p>
            </div>
            <p className="txt-7 pt-2">
                {offer.company.location}
            </p>
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

export default ListItem
