import { useRef, useState } from 'react'

import css from './../../static/css/auth/style.module.css'
import loading_gif from './../../static/img/loading.gif'
import Authorization from '../../request/authorization'
import { useNavigate } from 'react-router-dom'


const ChangePassword = () => {

    let navigate = useNavigate()

    const [personalInfo, setPersonalInfo] = useState('')
    const [loading, setLoading] = useState(false)

    const oldPassword = useRef()
    const password1 = useRef()
    const password2 = useRef()

    const formSubmit = async (event) => {
        event.preventDefault()

        let [pas1, pas2] = [password1.current.value, password2.current.value]

        if (pas1 === pas2) {

            if (pas1.length >= 8) {

                const infoUser = localStorage.getItem('infoUser') ? JSON.parse(localStorage.getItem('infoUser')) : null

                if (infoUser) {

                    const data = {
                        'old_password': oldPassword.current.value,
                        'new_password': password1.current.value,
                    }
                    setLoading(true)
                    const res = await Authorization('http://127.0.0.1:8000/api/v1/auth/chang_password/', infoUser.token, true, data)
                    setLoading(false)
                    if (res?.status != 400) {
                        setPersonalInfo(res?.detail)
                        setTimeout(() => {setPersonalInfo(''); navigate('/auth/')}, 2500)

                    } else {
                        setPersonalInfo('Ошибка при ввода старого пароля ')
                        setTimeout(() => setPersonalInfo(''), 2500)
                    }
                }

            } else {
                setPersonalInfo('Ошибка пароль слишком короткий')
                setTimeout(() => setPersonalInfo(''), 2500)
            }
        } else {
            setPersonalInfo('Пароли не совпадают')
            setTimeout(() => setPersonalInfo(''), 2000)
        }


    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: '30rem' }}>
                <h3 className={css.h3}>Смена Пароля</h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={formSubmit}>

                    <label htmlFor="" className={css.label}>
                        <p className={css.label_text}>Старый пароль</p>
                        <input type="password" ref={oldPassword} className={css.input} />
                    </label>

                    <label htmlFor="" className={css.label}>
                        <p className={css.label_text}>Новый пароль</p>
                        <input type="password" ref={password1} className={css.input} />
                    </label>

                    <label htmlFor="" className={css.label}>
                        <p className={css.label_text}>Повторите новый пароль</p>
                        <input type="password" ref={password2} className={css.input} />
                    </label>

                    <button type="submit" className={css.button_submit}>{loading ? <img src={loading_gif} alt="" /> : 'Изменить'}</button>
                    <span style={{ fontSize: '16px' }}>{personalInfo}</span>
                </form>
            </div>
        </>
    )
}

export default ChangePassword