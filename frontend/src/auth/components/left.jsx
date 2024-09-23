import { NavLink, useNavigate } from 'react-router-dom'
import css from './../../static/css/auth/style.module.css'
import { useState, useRef, useEffect } from 'react'

const Left = () => {
    const navigate = useNavigate()

    const dataPersonal = useRef()
    const historyHouse = useRef()
    const changePassword = useRef()
    const BecomeLandlord = useRef()

    const [active, setActive] = useState(dataPersonal)


    useEffect(() => {

        dataPersonal.current.className = css.text_li
        historyHouse.current.className = css.text_li
        changePassword.current.className = css.text_li
        BecomeLandlord.current.className = css.text_li

        active.current.className = `${css.text_li} ${css.active}`
        navigate(active.current.pathname)
    }, [active])

    return (
        <>
            <aside>
                <nav>
                    <ul className={css.aside_nav_ul}>
                        <h3 className={css.my_account}>Мой аккаунт</h3>
                        <NavLink className={css.text_li} to='/auth/history/'  onClick={() => setActive(historyHouse)} ref={historyHouse}>История аренды</NavLink>
                        <NavLink className={css.text_li} to='/auth/'  onClick={() => setActive(dataPersonal)} ref={dataPersonal}>Персональные данные</NavLink>
                        <NavLink className={css.text_li} to='/auth/change_password/'  onClick={() => setActive(changePassword)} ref={changePassword}>Смена пароля</NavLink>
                        <NavLink className={css.text_li} to='/auth/landlord/'  onClick={() => setActive(BecomeLandlord)} ref={BecomeLandlord}>Стать арендодателем</NavLink>
                        <button  className={css.text_li} style={{color:'rgb(179, 179, 179)',cursor:'pointer'}} type="button">Выйти</button>
                    </ul>
                </nav>
            </aside>
        </>
    )
}


export default Left