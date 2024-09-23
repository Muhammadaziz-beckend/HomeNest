import { useRef, useState } from 'react'

import css from './../../static/css/auth/style.module.css'
import loading_gif from './../../static/img/loading.gif'
import Authorization from '../../request/authorization'


const ChangePassword = () => {

    const [personalInfo, setPersonalInfo] = useState('')
    const [loading, setLoading] = useState(false)

    const oldPassword = useRef()
    const password1 = useRef()
    const password2 = useRef()

    const formSubmit = (event) => {
        event.preventDefault()

        Authorization()
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