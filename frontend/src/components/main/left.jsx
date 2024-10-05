import { useState, useEffect } from 'react';




const Left = ({setLeftFilter}) => {
    let [data, setData] = useState([])
    let [dataSectionRoomType, setSectionRoomType] = useState([])
    let [dataSectionInRoom, setSectionInRoom] = useState([])
    let [dataSectionInTheTerritory, setSectionInTheTerritory,] = useState([])
    let [dataSectionNear, setSectionNear] = useState([])
    let [dataSectionHouseRules, setSectionHouseRules] = useState([])

    const [valueInputNum, setValueInputNum] = useState('');
    const [valueInputNum2, setValueInputNum2] = useState('');


    const handleInputChange = (e) => {
        const newValue = e.target;
        if ((newValue.value.length <= 2 && newValue.value <= 10)) {

            if (newValue.value >= 1) {
                if (newValue.name === 'number_of_separate_beds') {
                    setValueInputNum2(newValue.value);
                } else if (newValue.name === 'number_of_double_beds') {
                    setValueInputNum(newValue.value);
                }
            } else {
                if (newValue.name === 'number_of_separate_beds') {
                    setValueInputNum2('');
                } else if (newValue.name === 'number_of_double_beds') {
                    setValueInputNum('');
                }
            }


        }
    };

    useEffect(() => {

        async function getSelectCheckbox(url, name) {
            const resJson = await (await fetch(url)).json()

            if (name === 'accommodation-options') {
                setData(resJson)
            } else if (name === 'room-type') {
                setSectionRoomType(resJson)
            } else if (name === 'in-room') {
                setSectionInRoom(resJson)
            } else if (name === 'in-the-territory') {
                setSectionInTheTerritory(resJson)
            } else if (name === 'near') {
                setSectionNear(resJson)
            } else if (name === 'house-rules') {
                setSectionHouseRules(resJson)
            }
        }
        // room-type
        getSelectCheckbox('http://127.0.0.1:8000/api/v1/accommodation-options/', 'accommodation-options')
        getSelectCheckbox('http://127.0.0.1:8000/api/v1/room-type/', 'room-type')
        getSelectCheckbox('http://127.0.0.1:8000/api/v1/in-room/', 'in-room')
        getSelectCheckbox('http://127.0.0.1:8000/api/v1/in-the-territory/', 'in-the-territory')
        getSelectCheckbox('http://127.0.0.1:8000/api/v1/near/', 'near')
        getSelectCheckbox('http://127.0.0.1:8000/api/v1/house-rules/', 'house-rules')


    }, [])


    const headSubmit = (event) => {
        event.preventDefault()

        let formGet = new FormData(event.target)
        

        if (formGet.get('is_elevator') == 'on') {
            formGet.set('is_elevator','true')
        }

        let obj = {}

        for (let [key, value] of formGet.entries()) {

            if (key in obj) {
                obj[key].push(value)
            }else {
                if (value != '') {
                    obj[key] = [value]
                }
            }

        }
        console.log(obj);
        

        setLeftFilter(obj);
        
        
    }


    return (
        <aside>
            <form method="get" onSubmit={headSubmit}>

                <div className="form-main">

                    <label htmlFor="" className="Hotel">
                        <h3>Варианты размещения</h3>

                        {data.map(i => (

                            <label className="check">
                                <input type='radio' name='accommodation_options' id={i?.id} value={i?.id} className="checkbox" />
                                <span className="fuck_checkbox"></span>
                                {i?.name}
                                <span className="count">{i?.house_count}</span>
                            </label>
                        ))}
                    </label>


                    <label htmlFor="" className="Selected">
                        <h3 className='h3'>Количество комнат</h3>

                        <select name="room_type" className='select-fr'>
                            <option value="">Любое</option>

                            {dataSectionRoomType.map(i => (
                                <option value={i?.id}>{i?.num} комнат</option>
                            ))}
                        </select>

                        <p className='small-h3'>Количество двуспальных кроватей</p>

                        <input onChange={handleInputChange} type="number" name="number_of_double_beds" id="" className='select-fr' min={1} max={10} placeholder='Выберите' value={valueInputNum} />

                        <p className="small-h3">Количество раздельных кроватей</p>

                        <input onChange={handleInputChange} type="number" name="number_of_separate_beds" id="" className='select-fr' min={1} max={10} placeholder='Выберите' value={valueInputNum2} />
                    </label>

                    <label htmlFor="" className="Hotel">
                        <h3>В помещении</h3>

                        {dataSectionInRoom.map(i => (

                            <label className="check">
                                <input type="checkbox" name='in_room' id={i?.id} value={i?.id} className="checkbox" />
                                <span className="fuck_checkbox"></span>
                                {i.name}
                            </label>
                        ))}
                    </label>


                    <label htmlFor="" className="Hotel">
                        <h3>На территории</h3>

                        {dataSectionInTheTerritory.map(i => (

                            <label className="check">
                                <input type="checkbox" name='in_the_territory' id={i?.id} value={i?.id} className="checkbox" />
                                <span className="fuck_checkbox"></span>
                                {i.name}
                            </label>
                        ))}
                    </label>



                    <label htmlFor="" className="Hotel">
                        <h3>Рядом</h3>

                        {dataSectionNear.map(i => (

                            <label className="check">
                                <input type="checkbox" name='near' id={i?.id} value={i?.id} className="checkbox" />
                                <span className="fuck_checkbox"></span>
                                {i.name}
                            </label>
                        ))}
                    </label>

                    <label htmlFor="" className="Hotel">
                        <h3>Правила дома</h3>

                        {dataSectionHouseRules.map(i => (

                            <label className="check">
                                <input type="checkbox" name='house_rules' id={i?.id} value={i?.id} className="checkbox" />
                                <span className="fuck_checkbox"></span>
                                {i.name}
                            </label>
                        ))}
                    </label>

                    <label htmlFor="" className="Hotel">
                        <h3>Доступность для инвалидов</h3>

                        <label className="check">
                            <input type="checkbox" name='is_elevator' className="checkbox" />
                            <span className="fuck_checkbox"></span>
                            лифта
                        </label>
                    </label>

                </div>

                <button type="submit" >Показать результат</button>
                <button type="reset">Сбросить фильтры</button>
            </form>
        </aside>
    )


}


export default Left