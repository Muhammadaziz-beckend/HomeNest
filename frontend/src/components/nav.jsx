import React, { useState, useEffect, useRef } from 'react';

const Nav = ({ onFiltersUpdate }) => {
    const [selectValue, setSelectValue] = useState('');
    const citeRef = useRef(null);
    const roomTypeRef = useRef(null);
    const regionRef = useRef(null);

    const getRespond = async (url, ref, inner, value) => {
        try {
            let getResJson = await (await fetch(url)).json();


            if (value) {
                getResJson = getResJson.filter(i => i.cite  == value);
            }

            const element = ref.current;
            if (element) {
                element.innerHTML = '';
                if (inner) {
                    element.innerHTML = inner;
                }

                for (let i = 0; i < getResJson.length; i++) {
                    let option = document.createElement('option');
                    option.value = getResJson[i]?.id;
                    option.textContent = getResJson[i]?.name || `${getResJson[i]?.num} номер`;
                    element.append(option);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getRespond('http://127.0.0.1:8000/api/v1/cite/', citeRef, '<option value="">Город</option>');
        getRespond('http://127.0.0.1:8000/api/v1/room-type/', roomTypeRef,'<option value="">Тип комнаты</option>');
    }, []);

    const handleCityChange = async (event) => {
        const idValue = Number(event.target.value);
        
        setSelectValue(idValue);
        if (!idValue) {
            regionRef.current.innerHTML = '<option value="">Выберите Город</option>';
        } else {
            await getRespond('http://127.0.0.1:8000/api/v1/region/', regionRef, '<option value="">Район</option>', idValue);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const city = citeRef.current.value;
        const region = regionRef.current.value;
        const roomType = roomTypeRef.current.value;
        
        // Передаем обновленные фильтры в родительский компонент
        onFiltersUpdate({ city, region, roomType });
    };

    return (
        <nav className="nav">
            <div className="container">
                <div className="nav-items">
                    <h3>Жилье на южном берегу Крыма по самым лучшим ценам</h3>
                    <form onSubmit={handleSubmit} className='form-get' >
                        <label htmlFor="Cite" className="select-wrapper">
                            <select id='Cite' name='city' onChange={handleCityChange} ref={citeRef}>
                                <option value="">Город</option>
                            </select>
                        </label>

                        <label htmlFor="Region" className="select-wrapper">
                            <select id='Region' name='region' ref={regionRef}>
                                <option value="">Выберите Город</option>
                            </select>
                        </label>

                        <label htmlFor="room_type" className="select-wrapper">
                            <select id='room_type' name='room_type' ref={roomTypeRef}>
                                <option value="">Тип комнаты</option>
                            </select>
                        </label>

                        <button type="submit">Найти жилье</button>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
