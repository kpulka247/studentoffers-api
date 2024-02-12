import React, {useEffect, useRef} from 'react'

export default function ImagePreview({imageUrl, onClose}) {

    const imageRef = useRef()

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        const handleOutsideClick = (event) => {
            if (imageRef.current && !imageRef.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [onClose])

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center'>
            <div ref={imageRef}>
                <img
                    className='max-w-full max-h-full'
                    src={imageUrl}
                    alt='Preview'
                />
            </div>
        </div>
    )
}