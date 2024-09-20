import { useRef, useState, useEffect } from 'react'
import css from './../../static/css/auth/style.module.css'
import Phone from '../components/phone'
import axios from 'axios'
import loading_gif from './../../static/img/loading.gif'
import { useNavigate } from 'react-router-dom'
 
const Right = () => {

    let navigate = useNavigate()

    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const [personalInfo, setPersonalInfo] = useState('')

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const infoUser = JSON.parse(localStorage.getItem('infoUser'))

        
        firstName.current.value = infoUser?.first_name
        lastName.current.value = infoUser?.last_name
        email.current.value = infoUser?.email

        
        if (!localStorage.getItem('infoUser')) {
            navigate('/auth/login/')
        }

    }, [])



    const formSubmit = (event) => {
        event.preventDefault()

        const infoUser = JSON.parse(localStorage.getItem('infoUser'))

        const changeFn = async (old_info, new_info) => {
            let change = false

            const { email, last_name, first_name } = old_info

            console.log(email, last_name, first_name);
            console.log(new_info);
            console.log(new_info?.email)

            if (!(new_info?.email === email && new_info?.last_name === last_name && new_info?.first_name === first_name)) {
                change = true
            }
            if (change) {
                let idInfoUser = infoUser?.id
                if (!idInfoUser) return false
                try {
                    setLoading(true)
                    let res = await axios.patch(`http://127.0.0.1:8000/api/v1/auth/update/?pk=${idInfoUser}`,
                        new_info
                    )

                    localStorage.setItem("infoUser", JSON.stringify(res?.data));
                    setPersonalInfo('успешно изменено')

                    setTimeout(() => setPersonalInfo(''), 3500)
                } catch {  } finally {
                    setLoading(false)
                }

            }
        }

        const new_info = {
            email: email.current.value,
            first_name: lastName.current.value,
            last_name: firstName.current.value,
        }

        changeFn(infoUser, new_info)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className={css.h3}>Персональные данные </h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={formSubmit}>
                <div className={css.last_first_name}>

                    <label htmlFor="" className={css.label}>
                        <p>Имя</p>
                        <input type="text" ref={firstName} className={css.input} />
                    </label>
                    <label htmlFor="" className={css.label}>
                        <p>Фамилия</p>
                        <input type="text" ref={lastName} className={css.input} />
                    </label>

                </div>
                <label htmlFor="" className={css.label}>
                    <p>Email</p>
                    <input type="email" ref={email} className={css.input} />
                </label>
                <button type="submit" className={css.button_submit}>{ loading ? <img src={loading_gif} alt="" /> : 'Изменить'}</button>
                <span style={{ fontSize: '16px' }}>{personalInfo}</span>
            </form>
        </div>
    )
}


export default Right