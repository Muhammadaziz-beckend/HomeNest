import { useState, useEffect } from 'react'
import Authorization from './../../request/authorization.jsx'
import css from './../../static/css/auth/style.module.css'
import HistoryBlok from './history_blok.jsx'

const History = ({ regionInfo, citeInfo }) => {

    const [history, setHistory] = useState(null)

    const { token, id } = JSON.parse(localStorage.getItem('infoUser'))

    useEffect(() => {
        Authorization(`http://127.0.0.1:8000/api/v1/auth/book-register-user/${id}`, token, true).then((r) => setHistory(r))
    }, [])


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className={css.h3}>История аренды</h3>

                <div className={css.blok_history}>
                    <div className={css.info_history}>
                        <ul className={css.info_history_ul}>
                            <li>начала</li>
                            <li>конец</li>
                            <li>цена</li>
                            <li>сумма</li>
                            <li>дата заказа</li>
                        </ul>
                    </div>

                    <HistoryBlok data={history} regionInfo={regionInfo} citeInfo={citeInfo} />
                </div>
            </div>
        </>
    )
}

export default History