import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = ({ setPhoneRef, click }) => {
    const [phone, setPhone] = useState('');


    if (setPhoneRef) {setPhoneRef('+' + phone)}
    return (
        <>
            <p> Введённый номер: {phone}</p>
            <PhoneInput
                country={'kg'}
                value={phone}

                onChange={setPhone}
                onClick={click ? click : null}
                placeholder="Введите номер телефона"
                style={{ marginTop: '10px',with:'100%'}}
            />
        </>
    );
};

export default PhoneNumberInput;
