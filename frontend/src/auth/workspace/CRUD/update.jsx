import { useEffect, useRef, useState } from "react"
import Axios_request from "../../../request/axios_request.jsx"
import Authorization from "../../../request/authorization.jsx"
import { useNavigate, useParams } from "react-router-dom"

const UpdateHouses = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const formRef = useRef(null)
    const regionRef = useRef(null)

    const [houseData, setHouseData] = useState(null)

    const [cite, setCite] = useState([])
    const [region, setRegion] = useState([])
    const [accommodationOptions, setAccommodationOptions] = useState([])
    const [houseRules, setHouseRules] = useState([])
    const [inRoom, setInRoom] = useState([])
    const [inTheTerritory, setInTheTerritory] = useState([])
    const [near, setNear] = useState([])
    const [roomType, setRoomType] = useState([])
    const [IncludedInThePrice, SetIncludedInThePrice] = useState([])
    const [forIndoorRelaxation, setForIndoorRelaxation] = useState([])
    const [kitchenEquipment, setKitchenEquipment] = useState([])
    const [yardEquipment, setYardEquipment] = useState([])
    const [bathroom, setBathroom] = useState([])

    const [field, setField] = useState(null)
    const [citeForm, setCiteForm] = useState(null)
    const [regionForm, setRegionForm] = useState(null)
    const [accommodationOptionsForm, setAccommodationOptionsForm] = useState(null)
    const [houseRulesForm, setHouseRulesForm] = useState(null)
    const [inRoomForm, setInRoomForm] = useState(null)
    const [inTheTerritoryForm, setInTheTerritoryForm] = useState(null)
    const [nearForm, setNearForm] = useState(null)
    const [roomTypeForm, setRoomTypeForm] = useState(null)
    const [IncludedInThePriceForm, SetIncludedInThePriceForm] = useState(null)
    const [forIndoorRelaxationForm, setForIndoorRelaxationForm] = useState(null)
    const [kitchenEquipmentForm, setKitchenEquipmentForm] = useState(null)
    const [yardEquipmentForm, setYardEquipmentForm] = useState(null)
    const [bathroomForm, setBathroomForm] = useState(null)
    const [isChecked, setIsChecked] = useState(false);
    const handleFileChange = (event) => {
        const files = event.target.files; // Получаем файлы из input
        if (files.length > 0) {
            setField(Array.from(files)); // Сохраняем файлы в состоянии как массив
        }

        console.log(files); // Выводим файлы для проверки
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Собираем данные формы
        const formDate = new FormData(event.target);

        // Преобразуем файлы в ссылки с помощью URL.createObjectURL (для тестирования, замените на реальные URL)
        // const imagesLinks = field.map(file => URL.createObjectURL(file)); 

        const formData2 = {
            "images": field, // Сохраняем имена файлов
            "accommodation_options": Number(accommodationOptionsForm) ? Number(accommodationOptionsForm) : accommodationOptions[0].id,
            "room_type": Number(roomTypeForm) ? Number(roomTypeForm) : roomType[0].id,
            "in_room": inRoomForm,
            "bathroom": bathroomForm,
            "house_rules": houseRulesForm,
            "included_in_the_price": IncludedInThePriceForm,
            "for_indoor_relaxation": forIndoorRelaxationForm,
            "in_the_territory": inTheTerritoryForm,
            "kitchen_equipment": kitchenEquipmentForm,
            "yard_equipment": yardEquipmentForm,
            "near": nearForm,
            "city": citeForm,
            "region": regionForm,
        };

        // Добавляем данные из FormData в formData2
        for (const [key, value] of formDate.entries()) {
            formData2[key] = value; // Устанавливаем значение в formData2
        }

        // Выводим содержимое formData2 для проверки
        console.log('formData2:', formData2);

        const { token } = JSON.parse(localStorage.getItem('infoUser'));

        // Отправляем данные на сервер
        Authorization(`http://127.0.0.1:8000/api/v1/houses/${id}/`, token, false, formData2, true, 'PATCH')
            .then(r => { console.log(r); })
            .catch(err => console.error('Ошибка:', err));
    };

    const changCiteUpdate = async (idValue) => {

        if (!idValue) return regionRef.current.innerHTML = '<option value="">Выберите Город</option>'

        await Axios_request('http://127.0.0.1:8000/api/v1/region/get-region-by-city/', { id: idValue }).then(async (r) => {
            setRegion(r.data)
        })
    }

    useEffect(() => {
        Axios_request(`http://127.0.0.1:8000/api/v1/houses/${id}/`).then(r => {
            setHouseData(r.data)
            if (r.data?.city) {
                console.log(region, r.data.city);

                changCiteUpdate(r.data.city);
                setIsChecked(r.data.is_elevator)
                let arr = []
                r.data?.bathroom.forEach(item => arr.push(item?.id))
                setBathroomForm(arr)
                setCiteForm(r.data?.city)
                arr = []
                r.data?.for_indoor_relaxation.forEach(item => arr.push(item?.id))
                setForIndoorRelaxationForm(arr)
                console.log(arr);
                arr = []
                setHouseRulesForm(r.data?.house_rules)
                setInRoomForm(r.data?.in_room)
                setInTheTerritoryForm(r.data?.in_the_territory)
                r.data?.included_in_the_price.forEach(item => arr.push(item?.id))
                SetIncludedInThePriceForm(arr)
                console.log(arr);
                arr = []
                r.data?.kitchen_equipment.forEach(item => arr.push(item?.id))
                setKitchenEquipmentForm(arr)
                console.log(arr);
                arr = []
                setNearForm(r.data?.near)
                setRegionForm(r.data?.region)
                r.data?.yard_equipment.forEach(item => arr.push(item?.id))
                setYardEquipmentForm(arr)
                arr = []
                setAccommodationOptionsForm(r.data?.accommodation_options)
            }
        })

        Axios_request('http://127.0.0.1:8000/api/v1/cite/',).then(r => setCite(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/accommodation-options/').then(r => setAccommodationOptions(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/house-rules/').then(r => setHouseRules(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/in-room/').then(r => setInRoom(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/in-the-territory/').then(r => setInTheTerritory(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/near/').then(r => setNear(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/room-type/').then(r => setRoomType(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/included-in-the-price/').then(r => SetIncludedInThePrice(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/for-indoor-relaxation/').then(r => setForIndoorRelaxation(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/kitchen-equipment/').then(r => setKitchenEquipment(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/yard-equipment/').then(r => setYardEquipment(r.data))
        Axios_request('http://127.0.0.1:8000/api/v1/bathroom/').then(r => setBathroom(r.data))
    }, [])

    const changCite = async (idValue) => {
        // const  = Number(event.target.value);

        if (!idValue) return regionRef.current.innerHTML = '<option value="">Выберите Город</option>'

        await Axios_request('http://127.0.0.1:8000/api/v1/region/get-region-by-city/', { id: idValue }).then(async (r) => {
            setRegion(r.data)
        })
    }

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    console.log(
        citeForm,
        regionForm,
        accommodationOptionsForm,
        houseRulesForm,
        inRoomForm,
        inTheTerritoryForm,
        nearForm,
        roomTypeForm,
        IncludedInThePriceForm,
        forIndoorRelaxationForm,
        kitchenEquipmentForm,
        yardEquipmentForm,
        bathroomForm,
        houseData
    );



    return (

        <div className="containerForm">
            <form method="post" enctype="multipart/form-data" onSubmit={handleSubmit} ref={formRef} className="formCreateUpdate">
                <h2>Изменить жильё</h2>


                <label htmlFor="">
                    <span>изображения</span>
                    <input
                        type='file'
                        id="file-input"
                        className="inputFile"
                        required
                        multiple
                        onChange={handleFileChange} // Добавляем обработчик события
                    />
                </label>


                <label htmlFor="" className="separator">

                    <div className="blokRegLeftInput">
                        <div className="leftInput">
                            <option value="">Названия улицы</option>
                            <input required type="text" defaultValue={houseData?.address} name="address" placeholder="Названия улицы" />
                        </div>

                        <div className="regtInput">
                            <option value="">Номер улицы</option>
                            <input required type="number" defaultValue={houseData?.street_number} name="street_number" id="" placeholder="Номер улицы" />
                        </div>
                    </div>

                </label>

                <label htmlFor="">
                    <option value="">Цена за 1 день</option>
                    <input type="number" defaultValue={houseData?.price} required name="price" id="" placeholder="Цена за 1 день" />
                </label>

                <label htmlFor="" className="selectLabelSeparator">

                    <select id="" required onChange={(event) => {
                        setCiteForm(event.target.value)
                        changCite(Number(event.target.value))
                    }
                    }>
                        <option value="">Город</option >
                        {cite.map(item => {
                            if (item?.id == houseData?.city) {
                                return (<option selected value={item.id}>{item.name}</option>)
                            }
                            return (<option value={item.id}>{item.name}</option>)
                        })}
                    </select>

                    <select id="" required ref={regionRef} onChange={(event) => setRegionForm(event.target.value)}>
                        {region.length == 0 ? <option value="">
                            Выберите Город
                        </option> : <option value="" >
                            Регион
                        </option>}
                        {region.map(item => {
                            if (houseData?.region == item?.id) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>

                </label>

                <label htmlFor="">
                    <option value="">Вариант размещения</option>
                    <select id="" required onChange={(event) => setAccommodationOptionsForm(event.target.value)}>
                        <option value="">Вариант размещения</option>
                        {accommodationOptions.map(item => {
                            if (houseData?.accommodation_options == item?.id) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="1">количество комнат</option>
                    <select required id="" onChange={(event) => setRoomTypeForm(event.target.value)}>
                        {roomType.map(item => {
                            if (houseData?.room_type == item?.id) {
                                return (<option selected value={item?.id}>{item?.num} комнатная</option>)
                            }
                            return (<option value={item?.id}>{item?.num} комнатная</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Количество спальни</option>
                    <input required type="number" defaultValue={houseData?.bedrooms} name="bedrooms" placeholder="Количество спальни" />
                </label>

                <label htmlFor="" className="separator">
                    <span>Количество кроватей</span>

                    <div className="blokRegLeftInput">
                        <div className="leftInput">
                            <input required type="number" defaultValue={houseData?.number_of_double_beds} name="number_of_double_beds" placeholder="Двуспальных" />
                        </div>

                        <div className="regtInput">
                            <input required type="number" defaultValue={houseData?.number_of_separate_beds} name="number_of_separate_beds" placeholder="Отдельных" />
                        </div>
                    </div>

                </label>

                <label htmlFor="" className="separator">

                    <div className="blokRegLeftInput">
                        <div className="leftInput">
                            <option value="">общая площадь m2</option>
                            <input required type="number" defaultValue={houseData?.total_area} name="total_area" placeholder="общая площадь" />
                        </div>

                        <div className="regtInput">
                            <option value="">Этаж</option>
                            <input required type="number" defaultValue={houseData?.floors} name="floors" placeholder="Этаж" />
                        </div>
                    </div>

                </label>

                <label htmlFor="">
                    <option value="">В помещении</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setInRoomForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {inRoom.map(item => {
                            if (houseData?.in_room.some(inRoomItem => inRoomItem === item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }

                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Ванная комната</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setBathroomForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {bathroom.map(item => {
                            if (houseData?.bathroom.some(bathroomItem => item?.id == bathroomItem?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Разрешено</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setHouseRulesForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {houseRules.map(item => {
                            if (houseData?.house_rules.some(houseRulesItem => houseRulesItem == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Входит в стоимость проживания</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        SetIncludedInThePriceForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {IncludedInThePrice.map(item => {
                            if (houseData?.included_in_the_price.some(i => i?.id == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Для отдыха в помещении</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setForIndoorRelaxationForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {forIndoorRelaxation.map(item => {
                            if (houseData?.for_indoor_relaxation.some(i => i?.id == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">На территории</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setInTheTerritoryForm(selectedOptions);
                        // Выводим выбранные значения в консоль
                    }}>
                        {inTheTerritory.map(item => {
                            if (houseData?.in_the_territory.some(i => i == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Кухонное оборудование</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setKitchenEquipmentForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {kitchenEquipment.map(item => {
                            if (houseData?.kitchen_equipment.some(i => i?.id == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Оснащение двора</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setYardEquipmentForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {yardEquipment.map(item => {

                            if (houseData?.yard_equipment.some(i => i?.id == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="">Рядом</option>
                    <select required id="" multiple onChange={(event) => {
                        const selectedOptions = Array.from(event.target.options) // Преобразуем HTMLCollection в массив
                            .filter(option => option.selected) // Фильтруем только выбранные элементы
                            .map(option => Number(option.value)); // Получаем значения выбранных элементов
                        setNearForm(selectedOptions); // Выводим выбранные значения в консоль
                    }}>
                        {near.map(item => {
                            if (houseData?.near.some(i => i == item?.id)) {
                                return (<option selected value={item?.id}>{item?.name}</option>)
                            }
                            return (<option value={item?.id}>{item?.name}</option>)
                        })}
                    </select>
                </label>

                <label htmlFor="checkbox" className="checkboxLabel">
                    <input type="checkbox" id="checkbox" name="is_elevator" className="chef" checked={isChecked}
                        onChange={handleCheckboxChange} />
                    <div className="fake"></div>
                    Есть лифт
                </label>


                <button>qwe</button>
            </form>
        </div>
    )
}

export default UpdateHouses