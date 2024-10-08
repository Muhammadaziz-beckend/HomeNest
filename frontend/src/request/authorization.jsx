import axios from "axios"


const Authorization = async (url, token, data = false, body = null,json=true) => {

    const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': json ? 'application/json' : 'multipart/form-data',
    }
    let res = null

    try {
        res = await axios({
            method: body ? 'POST' : 'GET', // Метод запроса: POST если есть body, иначе GET
            url: url,
            headers: headers,
            data: body // Тело запроса (будет отправлено только для POST/PUT запросов)
        })
        
        if (data) return res?.data

    } catch (error) {

        console.log(error);
        
        return (error);
    }

    return res
}


export default Authorization