import React, {useContext} from "react"
import AuthContext from "../context/AuthContext"
import {Link} from "react-router-dom";
import {usePasswordToggle} from "../utils/UseData"
import {useTranslation} from "react-i18next"


const LogInPage = () => {

    const [t] = useTranslation()
    const {loginUser} = useContext(AuthContext)
    const [toggleIcon, passwordInputType] = usePasswordToggle()

    return (
        <section className="flex justify-center items-center">
            <div
                className="w-full max-w-xl gap-6 lg:gap-8 px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <form
                    className="con-1 txt-1 text-center px-4 sm:px-6 md:px-8"
                    onSubmit={loginUser}>
                    <p className="my-8">{t("login.logging_in")}</p>
                    <div className="relative">
                        <input
                            className="inp-1 peer w-full mb-8"
                            type="text"
                            name="username"
                            placeholder="username"/>
                        <label className="lb-1">
                            {t("account.username")}
                        </label>
                    </div>
                    <div className="relative">
                        <div
                            className="flex rounded-lg border border-zinc-200 dark:border-zinc-600 transition focus-within:border-zinc-400 dark:focus-within:border-zinc-400 w-full mb-8">
                            <input
                                className="inp-1-nb transition peer grow"
                                type={passwordInputType}
                                name="password"
                                placeholder="password"/>
                            <label className="lb-1">
                                {t("account.password")}
                            </label>
                            <span className="txt-9 flex flex-col place-content-center place-items-end px-4">
                            {toggleIcon}
                            </span>
                        </div>
                    </div>
                    <div
                        className="inset-x-0 bottom-0 flex justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 mb-8">
                        <button
                            className="btn-1">
                            {t("button.log_in")}
                        </button>
                        <Link to={"/signup"}
                              className="btn-2 flex items-center">
                            {t("button.sign_up")}
                        </Link>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default LogInPage
