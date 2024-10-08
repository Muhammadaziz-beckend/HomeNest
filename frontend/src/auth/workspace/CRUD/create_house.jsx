import { useEffect, useRef, useState } from "react"
import Axios_request from "../../../request/axios_request.jsx"
import Authorization from "../../../request/authorization.jsx"
import { useNavigate } from "react-router-dom"


const CreateHouse = () => {
    const navigate = useNavigate()

    const formRef = useRef(null)
    const regionRef = useRef(null)

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
        Authorization('http://127.0.0.1:8000/api/v1/houses/', token, false, formData2)
            .then(r => {console.log(r) ; navigate('/auth/landlord/')})
            .catch(err => console.error('Ошибка:', err));
    };

    useEffect(() => {
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

    const changCite = async (event) => {
        const idValue = Number(event.target.value);

        if (!idValue) return regionRef.current.innerHTML = '<option value="">Выберите Город</option>'

        await Axios_request('http://127.0.0.1:8000/api/v1/region/get-region-by-city/', { id: idValue }).then(async (r) => {
            setRegion(r.data)
        })
    }

    return (

        <div className="containerForm">
            <form method="post" enctype="multipart/form-data" onSubmit={handleSubmit} ref={formRef} className="formCreateUpdate">
                <h2>Добавить жильё</h2>


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
                            <input required type="text" name="address" placeholder="Названия улицы" />
                        </div>

                        <div className="regtInput">
                            <input required type="number" name="street_number" id="" placeholder="Номер улицы" />
                        </div>
                    </div>

                </label>

                <label htmlFor="">
                    <input type="number" required name="price" id="" placeholder="Цена за 1 день" />
                </label>

                <label htmlFor="" className="selectLabelSeparator">

                    <select id="" required onChange={(event) => {
                        setCiteForm(event.target.value)
                        changCite(event)
                    }
                    }>
                        <option value="">Город</option >
                        {cite.map(item => (<option value={item.id}>{item.name}</option>))}
                    </select>

                    <select id="" required ref={regionRef} onChange={(event) => setRegionForm(event.target.value)}>
                        {region.length == 0 ? <option value="">
                            Выберите Город
                        </option> : <option value="" >
                            Регион
                        </option>}
                        {region.map(item => (<option value={item?.id}>{item?.name}</option>))}
                    </select>

                </label>

                <label htmlFor="">
                    <select id="" required onChange={(event) => setAccommodationOptionsForm(event.target.value)}>
                        <option value="">Вариант размещения</option>
                        {accommodationOptions.map(item => (<option value={item?.id}>{item?.name}</option>))}
                    </select>
                </label>

                <label htmlFor="">
                    <option value="1">количество комнат</option>
                    <select required id="" onChange={(event) => setRoomTypeForm(event.target.value)}>
                        {roomType.map(item => (<option value={item?.id}>{item?.num} комнатная</option>))}
                    </select>
                </label>

                <label htmlFor="">
                    <input required type="number" name="bedrooms" placeholder="Количество спальни" />
                </label>

                <label htmlFor="" className="separator">
                    <span>Количество кроватей</span>

                    <div className="blokRegLeftInput">
                        <div className="leftInput">
                            <input required type="number" name="number_of_double_beds" placeholder="Двуспальных" />
                        </div>

                        <div className="regtInput">
                            <input required type="number" name="number_of_separate_beds" placeholder="Отдельных" />
                        </div>
                    </div>

                </label>

                <label htmlFor="" className="separator">
                    <span>Количество кроватей</span>

                    <div className="blokRegLeftInput">
                        <div className="leftInput">
                            <input required type="number" name="total_area" placeholder="общая площадь" />
                        </div>

                        <div className="regtInput">
                            <input required type="number" name="floors" placeholder="Этаж" />
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
                        {inRoom.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {bathroom.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {houseRules.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {IncludedInThePrice.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {forIndoorRelaxation.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {inTheTerritory.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {kitchenEquipment.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {yardEquipment.map(item => (<option value={item?.id}>{item?.name}</option>))}
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
                        {near.map(item => (<option value={item?.id}>{item?.name}</option>))}
                    </select>
                </label>

                <label htmlFor="checkbox" className="checkboxLabel">
                    <input type="checkbox" id="checkbox" name="is_elevator" className="chef" />
                    <div className="fake"></div>
                    Есть лифт
                </label>

                <button>qwe</button>
            </form>
        </div>
    )
}

export default CreateHouse