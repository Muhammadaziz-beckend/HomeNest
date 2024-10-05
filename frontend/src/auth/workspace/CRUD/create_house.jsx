import { useRef } from "react"




const CreateHouse = () => {

    const formRef = useRef(null)

    const handleSubmit = () => {
        event.preventDefault()

        const formElements = formRef.current.elements;

        // Пробегаемся по всем input элементам и выводим их значения
        const formData = {};
        for (let element of formElements) {
            if (element.name) {
                formData[element.name] = element.value;
            }
        }

        // Выводим все данные формы
        console.log(formData);

    }

    return (

        <>
            <h2>Добавить жильё</h2>
            <form method="post" onSubmit={handleSubmit} ref={formRef}>

                <label htmlFor="">
                    <input type='file'/>
                    
                </label>

                <label htmlFor="">
                    <input type="text" name="address" />
                </label>
                <label htmlFor="">
                    <input type="number" name="street_number" id="" />
                </label>

                <label htmlFor="">
                    <input type="number" name="price" id="" />
                </label>

                <button>qwe</button>
            </form>
        </>
    )
}

export default CreateHouse