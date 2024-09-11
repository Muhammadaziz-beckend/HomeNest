// DatePickerInput.jsx
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

const DatePickerInput = ({ selectedDate, onChange, placeholder, minData,style }) => {
    const handleChange = (date) => {
        if (typeof onChange === 'function') {
            onChange(date);
        } else {
            console.error('onChange is not a function');
        }
    };

    // Устанавливаем сегодняшнюю дату как минимально доступную

    const minDate = minData ? new Date().setDate( new Date().getDate() + minData) : new Date()

    return (
        <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            placeholderText={placeholder}
            dateFormat="dd-MM-yyyy"
            className="custom-datepicker"
            name='start-data'
            minDate={minDate}
            locale={ru}
        />

    );
};

DatePickerInput.propTypes = {
    selectedDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    style: PropTypes.object,
};

DatePickerInput.defaultProps = {
    selectedDate: new Date(), // Установите текущую дату по умолчанию
    placeholder: 'Select a date',
    style: {},
};

export default DatePickerInput;
