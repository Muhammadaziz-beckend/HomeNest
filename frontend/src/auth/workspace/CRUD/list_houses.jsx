import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import not_faun from './../../../static/img/404.png';
import loading_gif from './../../../static/img/loading.gif'
import Authorization from "../../../request/authorization.jsx";
import BasicPagination from './../components/pagination.jsx'; // Импорт компонента пагинации
import axios from "axios";

const ListHouses = () => {
    const navigate = useNavigate()

    const [data, setData] = useState([]);
    const [cite, setCite] = useState([]);
    const [region, setRegion] = useState([]);
    const [inRoom, setInRoom] = useState([]);
    const [accommodationOptions, setAccommodationOptions] = useState([]);
    const [deleteItem, setDelete] = useState(null)
    const [deleteBlok,setDeleteBlok] = useState(false)
    const [loading, setLoading] = useState(false)

    // paginator
    const [pageNext, setPageNext] = useState(null);
    const [pagePrevious, setPagePrevious] = useState(null);
    const [page, setPage] = useState(1); // Начальная страница
    const [cuntPage, setCuntPage] = useState(1); // Общее количество страниц
    const [pageSize, setPageSize] = useState(8); // Количество элементов на странице

    const refHome = useRef(null); // Референс на блок с домами

    // Fetch data on page change
    useEffect(() => {
        async function fetchData() {
            try {
                const getHouseAll = async (url) => {
                    let userInfo = JSON.parse(localStorage.getItem('infoUser'));
                    const response = await Authorization(url, userInfo?.token, true);
                    if (response?.results) {
                        setData(response?.results);
                    } else {
                        setData(response);
                    }
                    setPageNext(response?.next);
                    setPagePrevious(response?.previous);
                    setCuntPage(Math.ceil(response.count / pageSize)); // Рассчитываем количество страниц
                };

                const getHouseAll2 = async (url, setData, isDataArray = true) => {
                    const resJson = await fetch(url).then((res) => res.json());
                    if (isDataArray) {
                        setData(resJson?.data);
                    } else {
                        setData(resJson);
                    }
                };

                // Запрос на получение данных по домам и дополнительным параметрам
                const url = `http://127.0.0.1:8000/api/v1/workspace/house/?page=${page}`;
                await getHouseAll(url);
                await getHouseAll2('http://127.0.0.1:8000/api/v1/cite/', setCite, false);
                await getHouseAll2('http://127.0.0.1:8000/api/v1/region/', setRegion, false);
                await getHouseAll2('http://127.0.0.1:8000/api/v1/in-room/', setInRoom, false);
                await getHouseAll2('http://127.0.0.1:8000/api/v1/accommodation-options/', setAccommodationOptions, false);

                // Прокручиваем страницу к началу блока домов при смене страницы
                if (refHome.current) {
                    refHome.current.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

        fetchData();
    }, [page]); // Запросы происходят при изменении page

    const deleteItemId = async () => {

        const { token } = JSON.parse(localStorage.getItem('infoUser')
        )
        setLoading(true)
        await axios.delete(`http://127.0.0.1:8000/api/v1/workspace/house/${deleteItem}/`, {
            headers: {
                Authorization: `Token ${token}`,  // Подставь свой токен
            }
        }).then(r => window.location.reload())
        setLoading(false)
    }

    return (
        <section>
            <div className="homes" ref={refHome}>
                {data.length !== 0 ? (
                    data.map((i, index) => (
                        <div className="blok" key={index}>
                            <div className="start">
                                <img src={i?.images[0]?.image || not_faun} alt="" />
                            </div>

                            <div className="center">
                                <h3>{i?.room_type}-Комнатная квартира</h3>
                                <p> Город-{cite.find(item => item?.id === i?.city)?.name || "Неизвестный город"},<br />
                                    {region.find(item => item?.id === i?.region)?.name || "Неизвестная область"}ская Область,<br />
                                    {i?.address} улица, {i?.street_number}
                                    <br />
                                    {accommodationOptions?.find(item => item?.id === i?.accommodation_options)?.name}
                                </p>
                                deleteItemId
                                <span>{i?.total_area} м² | {i?.bedrooms} спальня | {i?.number_of_double_beds + i?.number_of_separate_beds} кровать</span>

                                <div className="icons">
                                    {inRoom
                                        .filter(item => i?.in_room.includes(item?.id)) // фильтруем нужные иконки
                                        .slice(0, 4) // рендер первых 4
                                        .map((item, index) => (
                                            <img key={index} src={item?.image} alt="" className="icon" />
                                        ))}
                                    {i?.in_room.length > 4 && (
                                        <span className="cunt">+ {i?.in_room.length - 4}</span>
                                    )}
                                </div>
                            </div>

                            <div className="end">
                                <h3>{i?.price} c <br /> <span>Сутки</span></h3>
                                <Link to={`/home/${i?.id}`} className='first button'>Смотреть</Link>
                                <div className="blok_user_owner">
                                    <Link className="button">Изменить</Link>
                                    <button className="button" onClick={() => {setDelete(i?.id);setDeleteBlok(true) }}>Удалить</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="blok">
                        <div className="start">
                            <img src={not_faun} alt="" />
                        </div>
                        <div className="center">
                            <h3>0-Комнатная квартира</h3>
                            <p>Неизвестный город,<br /> "Неизвестная область",<br /> улица</p>
                            <span>0 м² | 0 спальня | 0 кровать</span>
                        </div>
                        <div className="end">
                            <h3>0 c <br /> <span>Сутки</span></h3>
                            <Link to="" className='first button'>Смотреть</Link>
                            <button className='last button'>Забронировать</button>
                        </div>
                    </div>
                )}

                {deleteBlok && <div className="blok_delete">
                    <div className="blok_delete_info">
                        <p>Вы точно хотите удалить</p>

                        <div className="blok_user_owner">
                            <button onClick={() => setDeleteBlok(false)}>Отмена</button>
                            <button onClick={deleteItemId}>{ loading ? <img src={loading_gif} alt="" /> : 'Ok'}</button>
                        </div>
                    </div>
                </div>}


                {/* Пагинация */}
                <BasicPagination
                    page={page} // Текущая страница
                    cuntPage={cuntPage} // Общее количество страниц
                    setPage={setPage} // Функция для изменения страницы
                    refHome={refHome} // Ссылка на блок с домами для прокрутки
                />
            </div>
        </section>
    );
};

export default ListHouses;
