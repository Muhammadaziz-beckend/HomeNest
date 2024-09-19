import { json, NavLink } from 'react-router-dom'
import './../static/css/auth/style.css'
import Phone from './components/phone.jsx'
import { useNavigate } from "react-router-dom"
import eye_open from './../static/img/eye_open.png'
import eye_close from './../static/img/eye_claus.png'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import loading_gif from './../static/img/loading.gif'


const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {

        if (localStorage.getItem('infoUser')) {
            navigate('/auth/')
        }
    },[])

    const [form, setForm] = useState(null)
    const [phone2, setPhone2] = useState(null)
    const password = useRef(null)
    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const [eye, setEye] = useState(eye_close)

    const submitForm = async (event) => {
        event.preventDefault()
        const phoneUser = phone2
        const passwordUser = password.current.value

        console.log(phoneUser, passwordUser);

        try {
            setLoading(true)
            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/',
                {
                    "phone": phoneUser,
                    "password": passwordUser
                }
            )

            if (!localStorage.getItem('infoUser')) {
                localStorage.setItem('infoUser',JSON.stringify(res?.data))
                navigate('/auth/')
            }
            

        } catch (error1) {
            setError(JSON.parse(error1?.request?.response)?.detail)
        }finally {
            setLoading(false)
        }


    }

    const eye_img = () => {
        if (password.current.type == 'password') {
            setEye(eye_open)
            password.current.type = 'text'
        } else {
            setEye(eye_close)
            password.current.type = 'password'
        }
    }


    return (
        <div className='form_root'>
            <NavLink to='/' className='back'>back home</NavLink>
            <form method="post" onSubmit={submitForm} className='form_login'>
                <h2>Аутентификация</h2>

                <label htmlFor="">
                    <Phone setPhoneRef={setPhone2} click={() => setError('')} />
                </label>
                <label htmlFor="">
                    <p>Введённый пароль:</p>
                    <div className="blok_position_eye">
                        <button onClick={eye_img} type="button" className='eye'><img src={eye} /></button>
                        <input onClick={() => setError('')} required ref={password} type="password" name="" id="" className='password' />
                    </div>
                    {error ? (<p style={{ color: 'reg', fontSize: '15px', width: '300px' }}>{error}</p>) : <></>}
                </label>

                <button type="submit">{ loading ? <img src={loading_gif} alt="" /> : 'Войти'}</button>
                <NavLink to='/auth/register/'>Зарегистрироваться</NavLink>
            </form>
        </div>
    )
}


export default Login