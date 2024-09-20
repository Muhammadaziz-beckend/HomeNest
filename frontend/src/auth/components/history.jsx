import { useState, useEffect } from 'react'
import Authorization from './../../request/authorization.jsx'
import css from './../../static/css/auth/style.module.css'

const History = () => {

    const [history, setHistory] = useState()

    const { token, id } = JSON.parse(localStorage.getItem('infoUser'))

    useEffect(() => {
        Authorization(`http://127.0.0.1:8000/api/v1/auth/book-register-user/${id}`, token, true).then((r) => setHistory(r))
    }, [])

    console.log(history);


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className={css.h3}>История аренды</h3>

                <div className={css.blok_history}>
                    <div className={css.info_history}>
                        <ul>
                            <li>начала</li>
                            <li>конец</li>
                            <li>цена</li>
                            <li>сумма</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default History