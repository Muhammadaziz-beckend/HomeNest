// HomeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../header';
import DatePickerInput from './inputData.jsx';
import './../../static/css/detail.css';
import MySwiper from './swiperMy.jsx';

import door from '../../static/img/door.svg'
import bad from '../../static/img/bed.svg'
import gost from '../../static/img/gost.svg'

const HomeDetail = () => {
  const [region, setRegion] = useState([]);
  const [cite, setCite] = useState([]);
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date()); // Установите текущую дату
  const [formData, setFormData] = useState({ date: new Date() });
  const [startDate2, setStartDate2] = useState(new Date().setDate(new Date().getDate() + 1)); // Установите текущую дату
  const [formData2, setFormData2] = useState({ date: new Date() });

  const [inRoom,setInRoom] = useState([])

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const getHouseAll = async (url, setData, data = true) => {
          const resJson = await (await fetch(url)).json();
          if (data) setData(resJson?.data);
          else setData(resJson);
        };
        await getHouseAll('http://127.0.0.1:8000/api/v1/region/', setRegion, false);
        await getHouseAll('http://127.0.0.1:8000/api/v1/cite/', setCite, false);
        await getHouseAll('http://127.0.0.1:8000/api/v1/in-room/', setInRoom, false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/houses/${id}`);
        const data = await response.json();
        setHome(data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }
  if (!home) {
    return <div>Дом не найден</div>;
  }

  const mainImage = home?.images?.[0]?.image;
  const otherImages = home?.images?.slice(1);

  const handleDateChange = (date) => {
    setStartDate(date);
    setFormData({ date });
  };

  const handleDateChange2 = (date) => {
    setStartDate2(date);
    setFormData2({ date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, formData2);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/submit-date/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        body: JSON.stringify(formData2),
      });
      const result = await response.json();
      console.log('Дата успешно отправлена:', result);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };

  const containerStyle = {
    width: 'auto',
    padding: '10px 0px',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',

    color: 'rgb(125, 125, 125)',
    fontFamily: 'var(--Roboto)',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '16px',
  };

  return (
    <>
      <Header detail={true} />

      <main className="main">
        <div className="container">
          <div className="main-items" style={{ display: 'flex', flexDirection: 'column' }}>

            <h3 className='h2Detail'>{home?.room_type}-Комнатная квартира — {cite.find(item => item?.id == home?.city)?.name}-{region.find(item => item?.id == home?.city)?.name}, {home?.address}, {home?.street_number}</h3>

            <div className="blok-sail">

              <div className='imageMain'>

                <MySwiper images={home?.images} />
              </div>

              <div className="sail_date">
                <form onSubmit={handleSubmit} method="post">
                  <label htmlFor="date-picker">
                    <DatePickerInput
                      selectedDate={startDate}
                      onChange={handleDateChange}
                      placeholder="Заезд"
                    />
                  </label>
                  <label htmlFor="date-picker">
                    <DatePickerInput
                      selectedDate={startDate2}
                      onChange={handleDateChange2}
                      minData={1}
                      placeholder="Выезд"
                    />
                  </label>
                  <label htmlFor="" className='prise'>
                    <h3>Цена:</h3>
                    <h4>от {home?.price} com</h4>
                  </label>
                  <button type="submit">Отправить</button>

                  <span className='info_prise'>Выберите даты и количество гостей
                    для расчёта стоимости проживания</span>
                </form>
              </div>

            </div>

            <div className="allInfo">

              <div className="info-room1 info">

                <h3>Ялта, Блюхера, 48 <br /> <span>3-комнатная квартира</span></h3>

                <div className="gruup">

                  <div className="blok">
                    <img src={door} alt="" />
                    <span>{home?.bedrooms} спальни</span>
                  </div>

                  <div className="blok">
                    <img src={bad} alt="" />
                    <span>{home?.number_of_double_beds} кровати</span>
                  </div>

                  <div className="blok">
                    <img src={gost} alt="" />
                    <span> {home?.total_guests} гостя</span>
                  </div>

                  <div className="blok">
                    <h4>{home?.total_area} m2</h4>
                    <span> общая площадь</span>
                  </div>

                  <div className="blok">
                    <h4>{home?.floors} из {home?.total_floors}</h4>
                    <span>этажей {home?.is_elevator ? '(есть лифт)' : '(нет лифта)'}</span>
                  </div>

                </div>

                <h6>Спальных мест</h6>
                <span> {home?.number_of_double_beds + home?.number_of_separate_beds}  кроватей</span>


              </div>



              <div className="info-room2 info">

                <h3>Правила размещения</h3>

                <div className="gruup">
                  <div className="blok">
                    <span className='forst'>Заезд</span>
                    <span className="last">После 14:00</span>
                  </div>

                  <div className="blok">
                    <span className='forst'>Отъезд</span>
                    <span className="last">До 12:00</span>
                  </div>

                  <div className="blok">
                    <span className='forst'>Минимальный срок проживания</span>
                    <span className="last">От 1 суток</span>
                  </div>


                </div>

              </div>


              <div className="info-room3 info">

                <h3>Описание</h3>


                <p style={containerStyle}>{home?.descriptions1}</p>

                <div className="gruup">

                  <div className="blok">
                    <h3>Ванная комната</h3>

                    <ul className='custom-list'>
                      {home?.bathroom.map(item => (<li>{item?.name}</li>))}
                    </ul>
                  </div>

                  <div className="blok">
                    <h3>Для отдыха в помещении</h3>

                    <ul className='custom-list'>
                      {home?.for_indoor_relaxation.map(item => (<li>{item?.name}</li>))}
                    </ul>
                  </div>

                  <div className="blok">
                    <h3>Кухонное оборудование</h3>
                    <ul className='custom-list'>
                      {home?.kitchen_equipment.map(item => (<li>{item?.name}</li>))}
                    </ul>
                  </div>

                  <div className="blok">
                    <h3>Доступность</h3>

                      <ul className='custom-list'>
                        {home?.is_elevator ? (<li>лифт</li> ): <></>}
                        <li> находится на {home?.floors} этаже</li>
                      </ul>
                  </div>

                  <div className="blok">
                    <h3>Входит в стоимость проживания</h3>

                      <ul className='custom-list'>
                        {home?.included_in_the_price.map(item => (<li>{item?.name}</li>))}
                      </ul>
                  </div>

                  <div className="blok">
                    <h3>Оснащение</h3>

                      <ul className='custom-list'>
                        {
                          home?.in_room.map(item => {
                            for (let i =0;i < inRoom.length;i++) {

                              return inRoom[i]?.id == item ? (<li>{inRoom[i]?.name}</li>): ''
                            }
                          })
                        }
                      </ul>
                  </div>
                    

                </div>
                  
                <div className="blok-info-plas" style={{marginTop:'20px'}}>
                <h3>Дополнительная информация</h3>
                <p style={containerStyle}>{home?.descriptions5}</p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default HomeDetail;
