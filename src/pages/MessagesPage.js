import React from "react"
import ListChat from "../components/ListChat"


const MessagesPage = () => {

    return (
        <section className="min-h-fit flex flex-grow w-full max-w-7xl mx-auto focus:outline-none px-4 sm:px-6 md:px-8 relative">
            <ListChat/>
        </section>
    )
}

export default MessagesPage