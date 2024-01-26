import React, {useState, useEffect, useContext} from "react"
import AuthContext from "../context/AuthContext"
import {useParams, useNavigate} from "react-router-dom"
import ConfirmationDialog from "../components/ConfirmationDialog"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"

// export function useUsersData() {
//
//     let [students, setStudents] = useState([])
//     let [companies, setCompanies] = useState([])
//     let {authTokens, logoutUser} = useContext(AuthContext)
//
//     useEffect(() => {
//
//     },[])
//
//     async function getUsers() {
//         let response = await  fetch(`/api/users/`,{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + String(authTokens.access)
//             }
//         })
//         let data = await response.json()
//
//         if (response.status === 200) {
//             setStudents(data.filter((user) => user.user_type === "Student"))
//             setCompanies(data.filter((user) => user.user_type === "Company"))
//         } else if (response.status === 401) {
//             logoutUser()
//         }
//         console.log('Users called!', data)
//     }
//     return {students, companies}
// }

export function useChatsData() {

    const [t] = useTranslation()
    const navigate = useNavigate()
    const [chats, setChats] = useState([])
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [chatToDelete, setChatToDelete] = useState(null)
    const {user, authTokens} = useContext(AuthContext)

    useEffect(() => {
        getChats()
    }, [])

    const getChats = async () => {
        let response = await fetch('/api/chats/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        let filteredChats = data.filter(chat => chat.sender.id === user.user_id || chat.receiver.id === user.user_id)
        setChats(filteredChats)
        // console.log(filteredChats)
    }

    const openConfirmation = (chatId) => {
        setChatToDelete(chatId)
        setShowConfirmation(true)
    }

    const closeConfirmation = () => {
        setChatToDelete(null)
        setShowConfirmation(false)
    }

    const deleteChat = async (chatId) => {
        await fetch(`/api/chats/${chatId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        const updatedChats = chats.filter(chat => chat.id !== chatId)
        closeConfirmation()
        setChats(updatedChats)
        navigate("/chat")
    }

    return {
        chats,
        deleteChat: openConfirmation,
        confirmationDialog: showConfirmation && (
            <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center ${
                showConfirmation ? '' : 'hidden'
            }`}>
                <ConfirmationDialog
                    confirmationMessage={t("confirmation.delete_chat")}
                    onConfirm={() => deleteChat(chatToDelete)}
                    onCancel={closeConfirmation}
                />
            </div>
        )
    }
}

export function useChatData() {

    const navigate = useNavigate()
    const [chat, setChat] = useState()
    const {user, authTokens} = useContext(AuthContext)
    const {offer, getOffer} = useOfferData()

    useEffect(() => {
        getOffer()
    }, [])

    const createChat = async () => {
        let senderId = user.user_id
        let receiverId = offer.company.id
        let response = await fetch(`/api/chats/new/${receiverId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({sender: senderId, receiver: receiverId})
        })
        let data = await response.json()
        setChat(data)
        navigate(`/chat/${data.id}`)
    }

    return {chat, createChat}
}

export function useMessagesData() {

    const [messages, setMessages] = useState([])
    const {authTokens} = useContext(AuthContext)

    const getMessages = async (chatId) => {
        let response = await fetch(`/api/chats/${chatId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        setMessages(data)
        // console.log(messages)
    }

    const sendMessage = async (chatId, content, file) => {

        const messageData = new FormData()

        if (content) {
            messageData.append('content', content);
        }

        if (file) {
            messageData.append('file', file)
        }

        let response = await fetch(`/api/chats/${chatId}/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authTokens.access
            },
            body: messageData
        })
        if (response.status === 200) {
            await getMessages(chatId)
        } else {
            console.log('Something went wrong!')
        }
    }

    const downloadFile = (fileUrl, fileName) => {
        const apiUrl = '/api'
        const downloadUrl = `${apiUrl}${fileUrl}`

        fetch(downloadUrl)
            .then(response => response.blob())
            .then(blob => {
                const fileUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = fileUrl
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
            })
            .catch(error => console.log(error))
    }

    return {messages, getMessages, sendMessage, downloadFile}
}

export function useOffersData() {

    const [offers, setOffers] = useState([])
    const [jobs, setJobs] = useState([])
    const [internships, setInternships] = useState([])
    const [apprenticeships, setApprenticeships] = useState([])
    const {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(() => {
        getOffers()
    }, [])

    const getOffers = async () => {
        let response = await fetch('/api/offers/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        data.forEach((offer) => {
            offer.date = new Date(offer.updated_at)
        })
        if (response.status === 200) {
            setOffers(data)
            setJobs(data.filter((offer) => offer.offer_type === "Job"))
            setInternships(data.filter((offer) => offer.offer_type === "Internship"))
            setApprenticeships(data.filter((offer) => offer.offer_type === "Apprenticeship"))
        } else if (response.status === 401) {
            logoutUser()
        }
    }

    return {offers, jobs, internships, apprenticeships}
}

export function useOfferData() {

    const [t] = useTranslation()
    const navigate = useNavigate()
    const offerId = useParams().id || 0

    const [offer, setOffer] = useState({offer_type: null})
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [offerToDelete, setOfferToDelete] = useState(null)
    const {authTokens} = useContext(AuthContext)

    const getOffer = async () => {
        if (offerId === 'new') return

        let response = await fetch(`/api/offers/${offerId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        setOffer(data)
    }

    const openConfirmation = (offerId) => {
        setOfferToDelete(offerId)
        setShowConfirmation(true)
    }

    const closeConfirmation = () => {
        setOfferToDelete(null)
        setShowConfirmation(false)
    }

    const createOffer = async () => {
        let response = await fetch(`/api/offers/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(offer)
        })

        if (response.status === 200) {
            getOffer()
        } else {
            console.log('Something went wrong!')
        }
        navigate("/account")
    }

    const updateOffer = async () => {
        let response = await fetch(`/api/offers/${offerId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(offer)
        })
        const data = await response.json()

        if (response.status === 200) {
            getOffer()
        } else {
            console.log('Something went wrong!')
        }
        navigate("/account")
    }

    const handleOfferSubmit = () => {
        if (offerId !== 'new' && !offer.offer) {
            deleteOffer()
        } else if (offerId !== 'new' && offer.offer) {
            updateOffer()
        } else if (offerId === 'new') {
            createOffer()
        }
        navigate("/account")
    }

    const deleteOffer = async () => {
        await fetch(`/api/offers/${offerId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        closeConfirmation()
        navigate("/account")
    }

    const handleOfferType = (offerType) => {
        setOffer({...offer, 'offer_type': offerType})
        localStorage.setItem('offerType', offerType)
    }

    return {
        offer,
        setOffer,
        getOffer,
        handleOfferSubmit,
        handleOfferType,
        deleteOffer: openConfirmation,
        confirmationDialog: showConfirmation && (
            <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center ${
                showConfirmation ? '' : 'hidden'
            }`}>
                <ConfirmationDialog
                    confirmationMessage={t("confirmation.delete_offer")}
                    onConfirm={() => deleteOffer(offerToDelete)}
                    onCancel={closeConfirmation}
                />
            </div>
        )
    }
}

export function usePasswordToggle() {

    let [visible, setVisibility] = useState(false)
    let iconEye = <FontAwesomeIcon
        icon={visible ? faEye : faEyeSlash}
        onClick={() => setVisibility(visibility => !visibility)}
    />
    let inputType = visible ? "text" : "password"

    return [iconEye, inputType]
}

export function useThemeSwitch() {

    const savedTheme = localStorage.getItem("theme") || "light"
    let [theme, setTheme] = useState(savedTheme)

    let handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return {theme, setTheme, handleThemeSwitch}
}

export function useWindowSize() {
    const [visibleOffers, setVisibleOffers] = useState(getWindowSize())

    function getWindowSize() {
        const screenWidth = window.innerWidth
        if (screenWidth >= 1280) {
            return 4
        } else if (screenWidth >= 1024 && screenWidth < 1280) {
            return 3
        } else if (screenWidth >= 640 && screenWidth < 1024) {
            return 2
        } else {
            return 1
        }
    }

    useEffect(() => {
        function handleResize() {
            setVisibleOffers(getWindowSize())
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return visibleOffers
}