import axios from "axios"


const Authorization = async (url,token,data=false) => {

    const headers = {
        'Authorization': `Token ${token}`
    }

    let res

    try {
        res = await axios(url,{headers})
        
        if (data) return res?.data

    }catch (error) {
        console.log(error);
        
    }  

    return res
}


export default Authorization