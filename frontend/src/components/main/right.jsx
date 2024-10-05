import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import not_faun from './../../static/img/404.png'
import Pagination from './pagination'

const Right = ({ props, refHome, citeInfo, regionInfo }) => {

    const [data, setData] = useState([])
    const [cite, setCite] = useState([])
    const [region, setRegion] = useState([])
    const [inRoom, setInRoom] = useState([])
    const [accommodationOptions, setAccommodationOptions] = useState([])

    // paginator
    const [page, setPage] = useState(1)
    const [pageSiz, setPageSize] = useState(8)
    const [cuntPage, setCountPage] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const getHouseAll = async (url, setData, data = true, setDataIgnore = null) => {

                    const resJson = await (await fetch(url)).json();

                    if (data) {
                        setPage(Number(resJson?.page))
                        setPageSize(Number(resJson?.page_size))
                        setCountPage(Number(resJson?.page_count))

                        setData(resJson?.data)

                        if (setDataIgnore != null) {
                            setDataIgnore(resJson?.data)
                        }
                    }
                    else {
                        setData(resJson);


                        if (setDataIgnore != null) {
                            setDataIgnore(resJson)
                        }
                    }
                };

                const buildUrlWithParams = (baseUrl, filters) => {
                    const url = new URL(baseUrl);

                    // Добавляем обычные параметры
                    if (filters.city) url.searchParams.append('city', filters.city);
                    if (filters.region) url.searchParams.append('region', filters.region);
                    if (filters.roomType) url.searchParams.append('room_type', filters.roomType);

                    // Добавляем массивы, такие как 'near' и 'house_rules'
                    for (let key in filters) {
                        if (Array.isArray(filters[key])) {
                            filters[key].forEach(value => {
                                url.searchParams.append(key, value);
                            });
                        }
                    }

                    return url.toString();
                };


                await getHouseAll(buildUrlWithParams(`http://127.0.0.1:8000/api/v1/houses/?page=${page}`, props), setData);
                await getHouseAll('http://127.0.0.1:8000/api/v1/cite/', setCite, false,citeInfo);
                await getHouseAll('http://127.0.0.1:8000/api/v1/region/', setRegion, false,regionInfo);
                await getHouseAll('http://127.0.0.1:8000/api/v1/in-room/', setInRoom, false);
                await getHouseAll('http://127.0.0.1:8000/api/v1/accommodation-options/', setAccommodationOptions, false);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

        fetchData();
    }, [props, page]);



    return (
        <section >
            <div className="homes" ref={refHome}>

                {data.length != 0 ? data.map(i => (

                    <div className="blok">

                        <div className="start">
                            <img src={i?.images[0]?.image} alt="" />
                        </div>

                        <div className="center">
                            <h3>{i?.room_type}-Комнатная квартира</h3>
                            <p> Город-{cite.find(item => item?.id == i?.city)?.name || "Неизвестный город"},<br />
                                {region.find(item => item?.id == i?.region)?.name || "Неизвестная область"}ская Область,<br />
                                {i?.address} улица, {i?.street_number}
                                <br />
                                {accommodationOptions?.find(item => item?.id == i?.accommodation_options)?.name}
                            </p>

                            <span>{i?.total_area} м2 | {i?.bedrooms} спальня | {i?.number_of_double_beds + i?.number_of_separate_beds} кровать  </span>

                            <div className="icons">

                                {
                                    inRoom
                                        .filter(item => i?.in_room.includes(item?.id)) // фильтруем нужные иконки
                                        .slice(0, 4) // рендер первые 4
                                        .map((item, index) => (
                                            <img key={index} src={item?.image} alt="" className="icon" />
                                        ))
                                }
                                {i?.in_room.length > 4 && (
                                    <span className="cunt">+ {i?.in_room.length - 4}</span>
                                )}
                            </div>
                        </div>

                        <div className="end">
                            <h3>{i?.price} c <br /> <span>Сутки</span></h3>
                            <Link to={`/home/${i?.id}`} className='first button'>Смотреть</Link>
                            {/* <Link to={`/home/${i?.id}`} className='last button'>Забронировать</Link> */}
                        </div>

                    </div>

                )) :
                    (

                        <div className="blok">

                            <div className="start">
                                <img src={not_faun} alt="" />
                            </div>

                            <div className="center">
                                <h3>0-Комнатная квартира</h3>
                                <p> Неизвестный город,<br />
                                    "Неизвестная область",<br />
                                    улица,
                                </p>

                                <span>0 м2 | 0 спальня | 0 кровать  </span>

                                <div className="icons">


                                </div>
                            </div>

                            <div className="end">
                                <h3>0 c <br /> <span>Сутки</span></h3>
                                <Link to='' className='first button'>Смотреть</Link>
                                <button className='last button'>Забронировать</button>
                            </div>

                        </div>)
                }
                <Pagination
                    color="secondary"
                    page={page}
                    pageSiz={pageSiz}
                    cuntPage={cuntPage}
                    setPage={setPage}
                    refHome={refHome}
                />
            </div>
        </section>

    )

}

export default Right