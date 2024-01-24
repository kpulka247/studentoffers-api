import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {usePasswordToggle} from "../utils/UseData"

const RegPage = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({user_type: 'Student'})
    const [toggleIcon, passwordInputType] = usePasswordToggle()

    const createUser = async () => {
        let response = await fetch(`/api/users/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        let data = await response.json()

        if (response.status === 200) {
            console.log('Successful registration!', data)
        } else {
            console.log('Something went wrong!')
        }
    }

    const handleUserSubmit = () => {
        createUser()
        navigate("/login")
    }

    const handleUserType = (userType) => {
        setUser({...user, 'user_type': userType})
    }

    return (
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 relative">
            <div className="gap-6 lg:gap-8">
                <div
                    className="con-1 txt-3 text-center">
                    <p className="my-8">Wybierz typ konta</p>
                    <div
                        className="inset-x-0 bottom-0 flex justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 mb-8">
                        <button
                            onClick={() => handleUserType('Student')}
                            className={user.user_type === 'Student' ? ("btn-1") : ("btn-2")}>
                            Student
                        </button>
                        <button
                            onClick={() => handleUserType('Company')}
                            className={user.user_type === 'Company' ? ("btn-1") : ("btn-2")}>
                            Firma
                        </button>
                    </div>
                </div>
            </div>
            {user.user_type && (
                <div className="gap-6 mt-8 lg:gap-8">
                    <figure
                        className="con-1 txt-9 px-4 sm:px-6 md:px-8">
                        <p className="txt-3 text-center my-8">
                            Uzupełnij wymagane dane
                        </p>
                        <div className="relative">
                            <input
                                className="inp-1 peer w-full mb-8"
                                type="text"
                                name="username"
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'username': e.target.value
                                    })
                                }}
                                defaultValue={user?.username}
                                placeholder="username"
                            />
                            <label className="lb-1">
                                Nazwa użytkownika
                            </label>
                        </div>
                        <div className="relative">
                            <div
                                className="flex rounded-lg border border-zinc-200 dark:border-zinc-600 transition focus-within:border-zinc-400 dark:focus-within:border-zinc-400 w-full mb-8">
                                <input
                                    className="inp-1-nb transition peer grow"
                                    type={passwordInputType}
                                    onChange={(e) => {
                                        setUser({
                                            ...user,
                                            'password': e.target.value
                                        })
                                    }}
                                    defaultValue={user?.password}
                                    placeholder="password"
                                />
                                <label className="lb-1">
                                    Hasło
                                </label>
                                <span className="txt-9 flex flex-col place-content-center place-items-end px-4">
                                {toggleIcon}
                            </span>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                className="inp-1 peer w-full mb-8"
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'email': e.target.value
                                    })
                                }}
                                defaultValue={user?.email}
                                placeholder="email"
                            />
                            <label className="lb-1">
                                Email
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                className="inp-1 peer w-full mb-8"
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'first_name': e.target.value
                                    })
                                }}
                                defaultValue={user?.first_name}
                                placeholder="first_name"
                            />
                            <label className="lb-1">
                                Imię
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                className="inp-1 peer w-full mb-8"
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        'last_name': e.target.value
                                    })
                                }}
                                defaultValue={user?.last_name}
                                placeholder="last_name"
                            />
                            <label className="lb-1">
                                Nazwisko
                            </label>
                        </div>
                        {user.user_type === 'Student' ? (
                            <>
                                <div className="relative">
                                    <input
                                        className="inp-1 peer w-full mb-8"
                                        type="text"
                                        maxLength={100}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                student: {
                                                    ...user.student,
                                                    field_of_study: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.student?.field_of_study}
                                        placeholder="field_of_study"
                                    />
                                    <label className="lb-1">
                                        Kierunek studiów
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        className="inp-1 peer w-full mb-8"
                                        type="text"
                                        maxLength={20}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                student: {
                                                    ...user.student,
                                                    student_id: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.student?.student_id}
                                        placeholder="student_id"
                                    />
                                    <label className="lb-1">
                                        Numer legitymacji studenckiej
                                    </label>
                                </div>
                            </>
                        ) : user.user_type === 'Company' ? (
                            <>
                                <div className="relative">
                                    <input
                                        className="inp-1 peer w-full mb-8"
                                        type="text"
                                        maxLength={100}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                company: {
                                                    ...user.company,
                                                    name: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.company?.name}
                                        placeholder="company_name"
                                    />
                                    <label className="lb-1">
                                        Pełna nazwa firmy
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        className="inp-1 peer w-full mb-8"
                                        type="text"
                                        maxLength={400}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                company: {
                                                    ...user.company,
                                                    description: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.company?.description}
                                        placeholder="company_description"
                                    />
                                    <label className="lb-1">
                                        Opis firm
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        className="inp-1 peer w-full mb-8"
                                        type="text"
                                        maxLength={150}
                                        onChange={(e) => {
                                            setUser({
                                                ...user,
                                                company: {
                                                    ...user.company,
                                                    location: e.target.value
                                                }
                                            })
                                        }}
                                        defaultValue={user?.company?.location}
                                        placeholder="company_location"
                                    />
                                    <label className="lb-1">
                                        Adres firmy
                                    </label>
                                </div>
                            </>
                        ) : null}
                        <div
                            className="mb-8 flex justify-center">
                            <button
                                onClick={handleUserSubmit}
                                className="btn-1">
                                Potwierdź
                            </button>
                        </div>
                    </figure>
                </div>
            )}

        </section>

    )
}


export default RegPage
