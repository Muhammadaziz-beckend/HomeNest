import axios from "axios"



const Axios_request = async (url, date = null) => {

    const res = await axios({
        method: date ? 'POST' : 'GET',
        url,
        data: date,
    })

    return (res);
}

export default Axios_request