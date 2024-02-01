import React, {lazy, Suspense, useState, useEffect, useContext} from "react"
import AuthContext from "../context/AuthContext"
import {useParams, useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"

const ConfirmationDialog = lazy(() => import("../components/ConfirmationDialog"))


// export function useUsersData() {
//
//     const [students, setStudents] = useState([])
//     const [companies, setCompanies] = useState([])
//     const {authTokens, logoutUser} = useContext(AuthContext)
//
//     useEffect(() => {
//
//     },[])
//
//     async function getUsers() {
//         const response = await  fetch(`/api/users/`,{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer ' + String(authTokens.access)
//             }
//         })
//         const data = await response.json()
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

export function useUsersData() {

    const [t] = useTranslation()
    const navigate = useNavigate()
    const [user, setUser] = useState({user_type: 'Student'})

    const createUser = async () => {

        try {
            const response = await fetch(`/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            if (response.ok) {
                const data = await response.json()
                alert(t("signup.account_created"))
                navigate("/login")
                // console.log('Successful registration!', data)
            } else {
                alert(t("signup.required_data"))
            }
        } catch (error) {
            console.error("Error during user create:", error)
        }
    }

    const handleUserSubmit = () => {
        createUser()
    }

    const handleUserType = (userType) => {
        setUser({...user, 'user_type': userType})
    }

    return {user, setUser, handleUserSubmit, handleUserType}
}

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

        try {
            const response = await fetch('/api/chats/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            const filteredChats = data.filter(chat => chat.sender.id === user.user_id || chat.receiver.id === user.user_id)
            setChats(filteredChats)
        } catch (error) {
            console.error("Error during chats request:", error)
        }
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

        try {
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
        } catch (error) {
            console.error("Error during chat delete:", error)
        }
    }

    return {
        chats,
        deleteChat: openConfirmation,
        confirmationDialog: showConfirmation && (
            <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center ${
                showConfirmation ? '' : 'hidden'
            }`}>
                <Suspense>
                    <ConfirmationDialog
                        confirmationMessage={t("confirmation.delete_chat")}
                        onConfirm={() => deleteChat(chatToDelete)}
                        onCancel={closeConfirmation}
                    />
                </Suspense>
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

        const senderId = user.user_id
        const receiverId = offer.company.id

        try {
            const response = await fetch(`/api/chats/new/${receiverId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({sender: senderId, receiver: receiverId})
            })
            const data = await response.json()
            setChat(data)
            navigate(`/chat/${data.id}`)
        } catch (error) {
            console.error("Error during chat create:", error)
        }
    }

    return {chat, createChat}
}

export function useMessagesData() {

    const [messages, setMessages] = useState([])
    const [hasNextPage, setHasNextPage] = useState(true)
    const {authTokens} = useContext(AuthContext)
    const [page, setPage] = useState(1)
    const limit = useState(20)

    const getMessages = async (chatId, page, limit) => {

        try {
            const response = await fetch(`/api/chats/${chatId}/?page=${page}&limit=${limit}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            setMessages(prevMessages => [...prevMessages, ...data.results])
            const hasNextPage = data.next !== null
            setHasNextPage(hasNextPage)
        } catch (error) {
            console.error("Error during request:", error)
        }
    }

    const getLatestMessage = async (chatId) => {

        try {
            const response = await fetch(`/api/chats/${chatId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            const data = await response.json()

            if (data.results.length > 0) {
                const latestMessage = data.results[0]
                setMessages(prevMessages => [latestMessage, ...prevMessages])
            }
        } catch (error) {
            console.error("Error during request:", error);
        }
    }

    const sendMessage = async (chatId, content, file) => {

        const messageData = new FormData()

        if (content) {
            messageData.append('content', content)
        }

        if (file) {
            const lowercaseFile = file.name.toLowerCase()
            const newFile = new File([file], lowercaseFile, {type: file.type})
            messageData.append('file', newFile)
        }

        try {
            const response = await fetch(`/api/chats/${chatId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + authTokens.access
                },
                body: messageData
            })
            if (response.ok) {
                await getLatestMessage(chatId)
            } else {
                console.log('Something went wrong!')
            }
        } catch (error) {
            console.error("Error during send message:", error)
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

    return {messages, setMessages, hasNextPage, page, setPage, limit, getMessages, sendMessage, downloadFile}
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

        try {
            const response = await fetch('/api/offers/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            data.forEach((offer) => {
                offer.date = new Date(offer.updated_at)
            })
            if (response.ok) {
                setOffers(data)
                setJobs(data.filter((offer) => offer.offer_type === "Job"))
                setInternships(data.filter((offer) => offer.offer_type === "Internship"))
                setApprenticeships(data.filter((offer) => offer.offer_type === "Apprenticeship"))
            } else if (response.status === 401) {
                logoutUser()
            }
        } catch (error) {
            console.error("Error during offers request:", error)
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

        try {
            const response = await fetch(`/api/offers/${offerId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            const data = await response.json()
            setOffer(data)
        } catch (error) {
            console.error("Error during offer request:", error)
        }
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

        try {
            const response = await fetch(`/api/offers/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(offer)
            })

            if (response.ok) {
                getOffer()
            } else {
                console.log('Something went wrong!')
            }
            navigate("/account")
        } catch (error) {
            console.error("Error during offer create:", error)
        }
    }

    const updateOffer = async () => {

        try {
            const response = await fetch(`/api/offers/${offerId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify(offer)
            })
            const data = await response.json()

            if (response.ok) {
                getOffer()
            } else {
                console.log('Something went wrong!')
            }
            navigate("/account")
        } catch (error) {
            console.error("Error during offer update:", error)
        }
    }

    const handleOfferSubmit = async () => {

        try {
            if (offerId !== 'new' && !offer.offer) {
                await deleteOffer()
            } else if (offerId !== 'new' && offer.offer) {
                await updateOffer()
            } else if (offerId === 'new') {
                await createOffer()
            }
            navigate("/account")
        } catch (error) {
            console.error("Error during offer submit:", error)
        }
    }

    const deleteOffer = async () => {

        try {
            await fetch(`/api/offers/${offerId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            closeConfirmation()
            navigate("/account")
        } catch (error) {
            console.error("Error during offer delete:", error)
        }
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
                <Suspense>
                    <ConfirmationDialog
                        confirmationMessage={t("confirmation.delete_offer")}
                        onConfirm={() => deleteOffer(offerToDelete)}
                        onCancel={closeConfirmation}
                    />
                </Suspense>
            </div>
        )
    }
}

export function usePasswordToggle() {

    const [visible, setVisibility] = useState(false)
    const iconEye = <FontAwesomeIcon
        icon={visible ? faEye : faEyeSlash}
        onClick={() => setVisibility(visibility => !visibility)}
    />
    const inputType = visible ? "text" : "password"

    return [iconEye, inputType]
}

export function useThemeSwitch() {

    const savedTheme = localStorage.getItem("theme") || "light"
    const [theme, setTheme] = useState(savedTheme)

    const handleThemeSwitch = () => {
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