import React, {useEffect, useRef} from "react"
import {useTranslation} from "react-i18next"

function ConfirmationDialog({confirmationMessage, onConfirm, onCancel}) {

    const [t] = useTranslation()
    const dialogRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                onCancel()
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [onCancel])

    return (
        <div className="con-2 px-8 min-w-[20rem]" ref={dialogRef}>
            <p className="txt-3 justify-around text-center mt-4 mb-8">{confirmationMessage}</p>
            <div className="place-content-between flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8 mb-4">
                <button
                    className="btn-3"
                    onClick={onCancel}>{t("button.cancel")}
                </button>
                <button
                    className="btn-1"
                    onClick={onConfirm}>{t("button.delete")}
                </button>
            </div>
        </div>
    )
}

export default ConfirmationDialog