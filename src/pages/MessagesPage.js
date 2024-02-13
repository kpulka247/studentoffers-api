import React, {lazy, Suspense, useContext, useEffect, useRef, useState} from 'react'
import AuthContext from '../context/AuthContext'
import {useChatsData, useMessagesData} from '../utils/UseData'
import {Link} from 'react-router-dom'
import {format} from 'date-fns'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faChevronLeft,
    faPaperclip,
    faTrash,
    faPaperPlane,
    faCircleNotch,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import {useTranslation} from 'react-i18next'
import ReactLinkify from 'react-linkify'
import _ from 'lodash'

const ImagePreview = lazy(() => import('../components/ImagePreview'))


export default function MessagesPage() {

    const [t] = useTranslation()
    const {user} = useContext(AuthContext)
    const {chats, getChats, deleteChat, confirmationDialog} = useChatsData()
    const {messages, setMessages, hasNextPage, page, setPage, limit, isSending, isLoading, getMessages, getLatestMessage, sendMessage, downloadFile} = useMessagesData()
    const [chatId, setChatId] = useState([])
    const [content, setContent] = useState('')
    const [file, setFile] = useState(null)
    const [selectedChatName, setSelectedChatName] = useState('')
    const containerRef = useRef(null)
    const [scrollActive, setScrollActive] = useState(true)
    const [scrollToBottom, setScrollToBottom] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl)
    }

    const handleCloseImagePreview = () => {
        setSelectedImage(null)
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.gif', '.bmp']

    const handleScroll = _.debounce((e) => {
        const container = e.target
        const scrollConverted = container.scrollTop + container.scrollHeight - container.clientHeight
        if (scrollConverted === 0 && !isLoading && hasNextPage && scrollActive) {
            loadMoreMessages()
            setScrollActive(true)
        }
        if (container.scrollTop <= -1000) {
            setScrollToBottom(true)
        } else {
            setScrollToBottom(false)
        }
    }, 100)

    const handleScrollToBottom = () => {
        const container = containerRef.current
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    }

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [handleScroll])

    const loadMoreMessages = () => {
        setScrollActive(false)
        if (!hasNextPage) return
        setPage(prevPage => prevPage + 1)
        getMessages(chatId, page + 1, limit)
    }

    const handleGetMessages = (chatId) => {
        setScrollActive(false)
        setChatId(chatId)
        setPage(1)
        setMessages([])
        if (chatId) {
            getMessages(chatId, 1, limit).then(() => {
                setScrollActive(true)
            })
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
        if (content.trim() !== '' || file !== null) {
            sendMessage(chatId, content, file)
            handleScrollToBottom()
            setContent('')
            setFile(null)
        }
    }

    const handleEnter = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendButton()
        }
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        setFile(selectedFile)
    }

    const handlePaste = (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items

        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const blob = item.getAsFile()
                handleFileChange({target: {files: [blob]}})
            }
        }
    }

    const getTime = (message) => {
        return format(new Date(message.created_at), 'dd/MM HH:mm')
    }

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            if (!isSending && chats.find(chat => chat.id === chatId)) {
                getLatestMessage(chatId)
            }
        }, 1000)

        return () => {
            clearInterval(refreshInterval)
        }
    }, [chatId, getLatestMessage, isSending])

    useEffect(() => {
        getChats()
    }, [])

    return (
        <section
            className='min-h-fit flex grow w-full max-w-7xl mx-auto focus:outline-none pt-8 md:pt-0 md:px-8 relative'>
            <div className='gap-6 lg:gap-8 w-full'>
                <figure className='con-1 px-0 rounded-none md:rounded-lg overflow-hidden h-80 min-h-full flex flex-col'>
                    {chats.find(chat => chat.id === chatId) && (
                        <div
                            className='md:hidden gap-x-4 sm:gap-x-6 flex justify-between items-center px-4 sm:px-6 pt-4 sm:pt-6'>
                            <button
                                className='btn-2-icon'
                                onClick={() => setChatId(null)}>
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </button>
                            <p className='txt-3 text-end overflow-auto break-words'>
                                {selectedChatName}
                            </p>
                        </div>
                    )}
                    <div className='flex grow overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8'
                         id='sc-1'>
                        <div
                            className={chats.find(chat => chat.id === chatId || chat.id !== chatId) ? (`w-full md:w-1/3 text-center ${chats.find(chat => chat.id === chatId) ? `hidden md:block` : ``}`) : null}>
                            <div className='overflow-y-auto md:pr-6 h-full'
                                 id='sc-1'>
                                {chats.map((chat, index) => (
                                    <Link
                                        key={index}
                                        onClick={() => handleGetMessages(chat.id)}
                                        to={`/chat/${chat.id}`}>
                                        <div
                                            className={chatId === chat.id ? ('btn-5 group relative') : ('btn-5-w')}>
                                            {chatId === chat.id ? (
                                                <button
                                                    className='btn-2-icon bg-zinc-100 dark:bg-zinc-700 opacity-0 group-hover:opacity-100 absolute self-end transition ease-in-out'
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
                                                                <p className='font-normal text-sm'>{chat.sender.student.field_of_study}</p>
                                                            </>
                                                        ) : chat.sender.user_type === 'Company' ? (
                                                            <>
                                                                <p>{chat.sender.company.name}</p>
                                                                <p className='font-normal text-sm'>{chat.sender.company.location}</p>
                                                            </>
                                                        ) : null}
                                                    </>
                                                ) : chat.sender.id === user.user_id ? (
                                                    <>
                                                        {chat.receiver.user_type === 'Student' ? (
                                                            <>
                                                                <p>{chat.receiver.first_name} {chat.sender.last_name}</p>
                                                                <p className='font-normal text-sm'>{chat.receiver.student.field_of_study}</p>
                                                            </>
                                                        ) : chat.receiver.user_type === 'Company' ? (
                                                            <>
                                                                <p>{chat.receiver.company.name}</p>
                                                                <p className='font-normal text-sm'>{chat.receiver.company.location}</p>
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
                            className={chats.find(chat => chat.id === chatId || chat.id !== chatId) ? (`w-full md:w-2/3 flex flex-col md:border-l border-zinc-200 dark:border-zinc-600 focus:outline-none md:pl-8 ${chats.find(chat => chat.id === chatId) ? `` : `hidden md:block`}`) : ('w-full')}>
                            {chats.find(chat => chat.id === chatId) ? (
                                <div
                                    className='txt-4 place-content-end flex flex-col-reverse flex-grow overflow-x-hidden overflow-y-auto'
                                    id='sc-1'
                                    ref={containerRef}>
                                    {messages.map((message, index) => (
                                        <div
                                            className={user.user_id === message.user.id ? ('w-full max-w-xl flex flex-col place-items-end pl-8 ml-auto') : ('w-full max-w-xl pr-8')}
                                            key={index}>
                                            <div
                                                className={user.user_id === message.user.id ? ('max-w-fit w-full py-2 px-4 mt-4 break-words rounded-lg bg-white dark:bg-zinc-600') : ('max-w-fit w-full py-2 px-4 mt-4 break-words rounded-lg border border-zinc-200 dark:border-zinc-600 align-start')}>
                                                <p className={user.user_id === message.user.id ? ('txt-10 text-right') : ('txt-10 text-left')}>
                                                    {message.user.first_name} {message.user.last_name} {getTime(message)}
                                                </p>
                                                <ReactLinkify
                                                    componentDecorator={(decoratedHref, decoratedText, key) => (
                                                        <a target='blank' href={decoratedHref} key={key}
                                                           className='btn-8'>
                                                            {decoratedText}
                                                        </a>
                                                    )}>
                                                    <p className='txt-6'>
                                                        {message.content}
                                                    </p>
                                                </ReactLinkify>
                                                <div
                                                    className={user.user_id === message.user.id ? ('flex place-content-end') : ('flex place-content-start')}>
                                                    {message.file && (
                                                        imageExtensions.some(ext => message.file.split('?')[0].endsWith(ext)) ? (
                                                            <div className='my-2'>
                                                                <img
                                                                    className='max-w-full cursor-pointer max-h-full rounded-lg'
                                                                    src={message.file}
                                                                    alt={message.file}
                                                                    onClick={() => handleImageClick(message.file)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className='text-start overflow-auto btn-4'
                                                                onClick={() => downloadFile(message.file, message.file.split('/').pop().split('?')[0])}>
                                                                <FontAwesomeIcon
                                                                    icon={faPaperclip}/> {message.file.split('/').pop().split('?')[0]}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='flex items-center justify-center'>
                                        {hasNextPage && !isLoading ? (
                                            <button className='btn-4' onClick={loadMoreMessages}>
                                                {t('chat.load_more')}
                                            </button>
                                        ) : isLoading ? (
                                            <div className='txt-11 animate-spin'>
                                                <FontAwesomeIcon icon={faCircleNotch}/>
                                            </div>
                                        ) : messages.length !== 0 ? (
                                            <p className='txt-10'>{t('chat.first_message')}</p>
                                        ) : null}

                                    </div>
                                </div>
                            ) : chats.find(chat => chat.id !== chatId) ? (
                                <div
                                    className='h-full place-content-center place-items-end flex flex-col overflow-auto'>
                                    {chats.find(chat => chat.id !== chatId) && (
                                        <p className='txt-2-w w-full text-center'>
                                            {t('chat.select_conversation')}
                                        </p>
                                    )}
                                </div>

                            ) : (
                                <div
                                    className='h-full place-content-center place-items-end flex flex-col overflow-auto'>
                                    <p className='txt-2-w w-full text-center'>
                                        {t('chat.press_contact')}
                                    </p>
                                </div>
                            )}
                            {chats.find(chat => chat.id === chatId) && (
                                <div className='flex gap-x-4 sm:gap-x-6 md:gap-x-8 w-full mt-4 sm:mt-6 md:mt-8'>
                                    <button
                                        className={file && file.name ? ('btn-2 truncate') : ('btn-2-icon')}
                                        onClick={() => document.getElementById('upload-button').click()}>
                                        {file ? file.name : (
                                            <FontAwesomeIcon icon={faPaperclip}/>)}
                                        <input
                                            type='file'
                                            id='upload-button'
                                            hidden
                                            onChange={handleFileChange}/>
                                    </button>
                                    <textarea
                                        id='sc-hide'
                                        rows={1}
                                        maxLength={800}
                                        className='inp-2'
                                        placeholder={isSending ? (t('chat.sending')) + '...' : (messages.length === 0 ? t('chat.type_first_message') + '...' : t('chat.type_message') + '...')}
                                        value={content}
                                        onChange={(event) => setContent(event.target.value)}
                                        onKeyDown={handleEnter}
                                        onPaste={handlePaste}
                                    />
                                    <button
                                        className='flex items-center btn-1-icon'
                                        onClick={handleSendButton}>
                                        <div className={isSending ? 'animate-spin' : 'hidden'}>
                                            <FontAwesomeIcon icon={faCircleNotch}/>
                                        </div>
                                        <div className={isSending ? 'hidden' : ''}>
                                            <FontAwesomeIcon icon={faPaperPlane}/>
                                        </div>
                                    </button>
                                </div>
                            )}
                            <button
                                className={`btn-1-icon animate-bounce absolute top-1/4 -translate-y-1/2 transition ${chatId && scrollToBottom ? 'opacity-100' : 'opacity-0'}`}
                                onClick={handleScrollToBottom}>
                                <FontAwesomeIcon icon={faChevronDown}/>
                            </button>
                        </div>
                    </div>
                </figure>
                {confirmationDialog}
                {selectedImage && (
                    <Suspense>
                        <ImagePreview imageUrl={selectedImage} onClose={handleCloseImagePreview}/>
                    </Suspense>
                )}
            </div>
        </section>
    )
}