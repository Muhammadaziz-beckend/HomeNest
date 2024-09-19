import Header from "./components/header.jsx"
import css from './../static/css/auth/style.module.css'
import Left from './components/left.jsx'
import Right from './components/right.jsx'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const AuthProfile = ({ component }) => {

    const navigate = useNavigate()


    if (!localStorage.getItem('infoUser')) {
        navigate('/auth/login/')
    }

    useEffect(() => {
        if (!localStorage.getItem('infoUser')) {
            navigate('/auth/login/')
        }
    }, [])

    return (
        <>
            <Header />

            <main className={css.aside}>
                <div className={css.container} >

                    <div className={css.main_items}>

                        <Left /> {component ? component : <Right />}


                    </div>

                </div>
            </main>
        </>
    )
}


export default AuthProfile