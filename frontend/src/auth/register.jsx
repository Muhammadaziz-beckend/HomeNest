import { useNavigate, NavLink } from "react-router-dom"
import Phone from './components/phone.jsx'
import eye_open from './../static/img/eye_open.png'
import eye_close from './../static/img/eye_claus.png'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import loading_gif from './../static/img/loading.gif'

const Register = () => {
    const navigate = useNavigate()

    useEffect(() => {

        if (localStorage.getItem('infoUser')) {
            navigate('/auth/')
        }
    },[])

    const [phone2, setPhone2] = useState(null)
    const firstName = useRef(null)
    const lastName = useRef(null)
    const email = useRef(null)
    const password = useRef(null)
    const password2 = useRef(null)
    const [error, setError] = useState('')
    const [errorPassword2, setErrorPassword2] = useState('')
    const [errorPhone,setErrorPhone] = useState('')

    const [loading, setLoading] = useState(false)

    const [eye, setEye] = useState(eye_close)
    const [eye2, setEye2] = useState(eye_close)

    const submitForm = async (event) => {
        event.preventDefault()

        const [last_nameUser, first_nameUser] = [lastName.current.value, firstName.current.value]
        const phoneUser = phone2
        const emailUser = email.current.value
        const passwordUser = password.current.value
        const password2User = password2.current.value

        if (!passwordUser === password2User) {
            setErrorPassword2('Пароли не совпадают!')
            return false
        }


        console.log(
            'name', first_nameUser, '\n',
            'lastName', last_nameUser, '\n',
            'phoneUser', phoneUser, '\n',
            'emailUser', emailUser, '\n',
            'passwordUser', passwordUser, '\n',
            'password2User', password2User, '\n',
        );


        try {

            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/register/',
                {
                    "phone":phoneUser,
                    'password':passwordUser,
                    'email':emailUser,
                    'last_name':last_nameUser,
                    "first_name":first_nameUser,
                }
            )


            localStorage.setItem("infoUser",JSON.stringify(res?.data));
            navigate('/auth/')

        }catch (error) {

            console.log(error?.response?.data);
            setErrorPhone(error?.response?.data?.detail);
            

        }finally {

        }


    }

    const eye_img = (ref, set_ref) => {
        if (ref.current.type == 'password') {
            set_ref(eye_open)
            ref.current.type = 'text'
        } else {
            set_ref(eye_close)
            ref.current.type = 'password'
        }
    }


    return (
        <>
            <div className='form_root'>
                <NavLink to='/' className='back'>back home</NavLink>
                <form method="post" onSubmit={submitForm} className='form_login'>
                    <h2>Регистрация</h2>

                    <label htmlFor="" className="register_last_first_name">
                        <p>Имя - Фамилия :</p>
                        <div className="last_first_name">
                            <input type="text" ref={firstName} required className='first_name' placeholder="Имя" />
                            <input type="text" ref={lastName} required className='last_name' placeholder="Фамилия" />
                        </div>
                    </label>
                    <label htmlFor="">
                        <p>Электронная почта:</p>
                        <input type="email" required ref={email} name="email" id="" className='password' />
                    </label>
                    <label htmlFor="">
                        <Phone setPhoneRef={setPhone2} click={() => setError('')} />
                        {errorPhone ? (<p style={{ color: 'red', fontSize: '15px', width: '300px' }}>{errorPhone}</p>) : <></>}
                    </label>
                    <label htmlFor="">
                        <p>Введённый пароль:</p>
                        <div className="blok_position_eye">
                            <button onClick={() => eye_img(password, setEye)} type="button" className='eye'><img src={eye} /></button>
                            <input onClick={() => setError('')} required ref={password} type="password" name="" id="" className='password' />
                        </div>
                        {error ? (<p style={{ color: 'red', fontSize: '15px', width: '300px' }}>{error}</p>) : <></>}
                    </label>
                    <label htmlFor="">
                        <p>Повторите пароль:</p>
                        <div className="blok_position_eye">
                            <button onClick={() => eye_img(password2, setEye2)} type="button" className='eye'><img src={eye2} /></button>
                            <input onClick={() => setErrorPassword2('')} required ref={password2} type="password" name="" id="" className='password' />
                        </div>
                        {errorPassword2 ? (<p style={{ color: 'red', fontSize: '15px', width: '300px' }}>{errorPassword2}</p>) : <></>}
                    </label>

                    <button type="submit">{loading ? <img src={loading_gif} alt="" /> : 'Войти'}</button>
                    <NavLink to='/auth/login/'>есть аккаунт?</NavLink>
                </form>
            </div>
        </>
    )
}


export default Register