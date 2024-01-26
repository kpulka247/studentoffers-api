import React, {useContext, useEffect, useRef, useState} from "react"
import AuthContext from "../context/AuthContext"
import {useChatsData, useMessagesData} from "../utils/UseData"
import {Link} from "react-router-dom"
import {format} from "date-fns"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronLeft, faPaperclip, faTrash} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"


const ListChat = () => {

    const [t] = useTranslation()
    const {user} = useContext(AuthContext)
    const {chats, deleteChat, confirmationDialog} = useChatsData()
    const {messages, getMessages, sendMessage, downloadFile} = useMessagesData()
    const [chatId, setChatId] = useState([])
    const [content, setContent] = useState('')
    const [file, setFile] = useState(null)
    const [selectedChatName, setSelectedChatName] = useState('')

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".tiff", ".gif", ".bmp"]

    const handleGetMessages = (chatId) => {
        setChatId(chatId)
        if (chatId) {
            getMessages(chatId)
            setFile(null)
        }

        const selectedChat = chats.find(chat => chat.id === chatId)
        if (selectedChat) {
            let userName = ''
            if (selectedChat.receiver.id === user.user_id) {
                if (selectedChat.sender.user_type === 'Student') {
                    userName = `${selectedChat.sender.first_name} ${selectedChat.sender.last_name}`
                } else if (selectedChat.sender.user_type === 'Company') {
                    userName = selectedChat.sender.company.name
                }
            } else if (selectedChat.sender.id === user.user_id) {
                if (selectedChat.receiver.user_type === 'Student') {
                    userName = `${selectedChat.receiver.first_name} ${selectedChat.receiver.last_name}`
                } else if (selectedChat.receiver.user_type === 'Company') {
                    userName = selectedChat.receiver.company.name
                }
            }
            setSelectedChatName(userName)
        }
    }

    const handleSendButton = () => {
        sendMessage(chatId, content, file)
        setContent('')
        setFile(null)
    }

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleSendButton()
        }
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        setFile(selectedFile)
    }

    const getTime = (message) => {
        return format(new Date(message.created_at), 'dd/MM HH:mm')
    }

    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div className="gap-6 lg:gap-8 w-full">
            <figure className="con-1 h-80 min-h-full flex flex-col px-4 sm:px-6 md:px-8">
                {chats.find(chat => chat.id === chatId) && (
                    <div className="md:hidden gap-x-4 sm:gap-x-6 flex justify-between items-center pt-4 sm:pt-6">
                        <button
                            className="btn-2-icon"
                            onClick={() => setChatId(null)}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <p className="txt-2 text-end overflow-auto break-words">
                            {selectedChatName}
                        </p>
                    </div>
                )}
                <div className="flex flex-grow overflow-y-auto py-4 sm:py-6 md:py-8">
                    <div
                        className={chats.find(chat => chat.id === chatId || chat.id !== chatId) ? (`w-full md:w-1/3 text-center ${chats.find(chat => chat.id === chatId) ? `hidden md:block` : ``}`) : null}>
                        <div className="overflow-y-auto md:pr-8 h-full">
                            {chats.map((chat, index) => (
                                <Link
                                    key={index}
                                    onClick={() => handleGetMessages(chat.id)}
                                    to={`/chat/${chat.id}`}>
                                    <div
                                        className={chatId === chat.id ? ("btn-5 group relative") : ("btn-5-w")}>
                                        {chatId === chat.id ? (
                                            <button
                                                className="btn-2-icon opacity-0 group-hover:opacity-100 absolute self-end transition ease-in-out"
                                                onClick={() => {
                                                    deleteChat(chatId)
                                                }}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                        ) : null}
                                        <div>
                                            {chat.receiver.id === user.user_id ? (
                                                <>
                                                    {chat.sender.user_type === 'Student' ? (
                                                        <>
                                                            <p>{chat.sender.first_name} {chat.sender.last_name}</p>
                                                            <p className="font-normal text-sm">{chat.sender.student.field_of_study}</p>
                                                        </>
                                                    ) : chat.sender.user_type === 'Company' ? (
                                                        <>
                                                            <p>{chat.sender.company.name}</p>
                                                            <p className="font-normal text-sm">{chat.sender.company.location}</p>
                                                        </>
                                                    ) : null}
                                                </>
                                            ) : chat.sender.id === user.user_id ? (
                                                <>
                                                    {chat.receiver.user_type === 'Student' ? (
                                                        <>
                                                            <p>{chat.receiver.first_name} {chat.sender.last_name}</p>
                                                            <p className="font-normal text-sm">{chat.receiver.student.field_of_study}</p>
                                                        </>
                                                    ) : chat.receiver.user_type === 'Company' ? (
                                                        <>
                                                            <p>{chat.receiver.company.name}</p>
                                                            <p className="font-normal text-sm">{chat.receiver.company.location}</p>
                                                        </>
                                                    ) : null}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div
                        className={chats.find(chat => chat.id === chatId || chat.id !== chatId) ? (`w-full md:w-2/3 flex flex-col bg-white dark:bg-zinc-700 md:border-l border-zinc-200 dark:border-zinc-600 focus:outline-none md:pl-8 ${chats.find(chat => chat.id === chatId) ? `` : `hidden md:block`}`) : ("w-full")}>
                        {chats.find(chat => chat.id === chatId) ? (
                            <div
                                className="txt-4 place-content-end flex-grow overflow-y-auto"
                                ref={scrollRef}>
                                {messages.length === 0 ? (
                                    <div className="h-full place-content-center flex flex-col">
                                        <p className="txt-2-w text-center w-full overflow-auto">
                                            {t("chat.write_first_message")} {selectedChatName}
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={user.user_id === message.user.id ? ("w-full max-w-xl flex flex-col place-items-end pl-8 ml-auto") : ("w-full max-w-xl pr-8")}>
                                            <div
                                                className={user.user_id === message.user.id ? ("max-w-fit w-full py-2 px-4 mt-4 break-words rounded-lg bg-zinc-100 dark:bg-zinc-600") : ("max-w-fit w-full py-2 px-4 mt-4 break-words rounded-lg border border-zinc-200 dark:border-zinc-600 align-start")}>
                                                <p className={user.user_id === message.user.id ? ("txt-10 text-right") : ("txt-10 text-left")}>
                                                    {message.user.first_name} {message.user.last_name} {getTime(message)}
                                                </p>
                                                <p className="txt-6">
                                                    {message.content}
                                                </p>
                                                <div
                                                    className={user.user_id === message.user.id ? ("flex place-content-end") : ("flex place-content-start")}>
                                                    {message.file && (
                                                        imageExtensions.some(ext => message.file.endsWith(ext)) ? (
                                                            <button
                                                                className="my-2"
                                                                onClick={() => downloadFile(message.file, message.file)}>
                                                                <img
                                                                    className="max-w-full max-h-full rounded-lg"
                                                                    src={`/api${message.file}`}
                                                                />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="text-start w-full break-words btn-4"
                                                                onClick={() => downloadFile(message.file, message.file)}>
                                                                {message.file.replace("/media/chat_files/", "")}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )))}
                            </div>
                        ) : chats.find(chat => chat.id !== chatId) ? (
                            <div className="h-full place-content-center place-items-end flex flex-col overflow-auto">
                                {chats.find(chat => chat.id !== chatId) && (
                                    <p className="txt-2-w w-full text-center">
                                        {t("chat.select_conversation")}
                                    </p>
                                )}
                            </div>

                        ) : (
                            <div className="h-full place-content-center place-items-end flex flex-col overflow-auto">
                                <p className="txt-2-w w-full text-center">
                                    {t("chat.press_contact")}
                                </p>
                            </div>
                        )}
                        {chats.find(chat => chat.id === chatId) && (
                            <div className="flex gap-x-4 sm:gap-x-6 md:gap-x-8 w-full mt-4 sm:mt-6 md:mt-8">
                                <button
                                    className={file && file.name ? ("btn-2 truncate") : ("btn-2-icon")}
                                    onClick={() => document.getElementById('upload-button').click()}>
                                    {file ? file.name : (
                                        <FontAwesomeIcon icon={faPaperclip}/>)}
                                    <input
                                        type="file"
                                        id="upload-button"
                                        hidden
                                        onChange={handleFileChange}/>
                                </button>
                                <input
                                    className="inp-2"
                                    type="text"
                                    placeholder={t("chat.type_message") + "..."}
                                    value={content}
                                    onChange={(event) => setContent(event.target.value)}
                                    onKeyDown={handleEnter}/>
                                <button
                                    className="hidden lg:flex items-center btn-1"
                                    onClick={handleSendButton}>{t("button.send")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </figure>
            {confirmationDialog}
        </div>
    )
}

export default ListChat