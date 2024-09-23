import { useEffect, useState } from 'react'
import css from '../../static/css/auth/style.module.css'
import navigateSvg from "../../static/img/navigate.svg"
import image from "../../static/img/404.png"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const Component = ({ dataStart, dataEnd, prise, totalPrise, dataAdd, house, citeInfo, regionInfo }) => {
    const [isOpen, setOpen] = useState(false)


    let navigate = useNavigate()

    if (citeInfo === undefined || regionInfo === undefined) {
        navigate('/')
    }

    return (
        <>
            <ul className={css.info_history_blok_ul}>
                <li>{dataStart}</li>
                <li>{dataEnd}</li>
                <li>{prise}</li>
                <li>{totalPrise}</li>
                <li>{dataAdd}</li>
                <button onClick={() => isOpen ? setOpen(false) : setOpen(true)} className={isOpen ? css.navigateUp : css.navigate}>
                    <img src={navigateSvg} alt="" />
                </button>
            </ul>
            {isOpen && (
                <div className={css.info_history_item}>
                    <div className={css.start}>
                        <img src={house?.images[0]?.image} alt="" />
                    </div>
                    <div className={css.center}>
                        <h3>1-Комнатная квартира</h3>
                        <p> Город-{citeInfo?.find(item => item?.id == house?.city)?.name || "Неизвестный город"},<br />
                            {regionInfo?.find(item => item?.id == house?.region)?.name || "Неизвестная область"}ская Область,<br />
                            {house?.address} улица, {house?.street_number}
                        </p>
                    </div>
                    <div className={css.end}>
                        <Link to={`/home/${house?.id}`} className='first button'>Смотреть</Link>
                    </div>
                </div>
            )}
        </>
    )
}

const HistoryBlok = ({ data, citeInfo, regionInfo }) => {

    const [history, setHistory] = useState(null)

    useEffect(() => {
        setHistory(data?.results)
    }, [data])

    console.log(history);


    return (
        <>
            <div className={css.info_history2}>

                {history?.map(item => (<Component dataStart={item?.data_start} dataEnd={item?.data_end} prise={item?.prise} totalPrise={item?.result_prise} dataAdd={item?.date_add} house={item?.home} citeInfo={citeInfo} regionInfo={regionInfo} />))}
            </div>
        </>
    )
}


export default HistoryBlok