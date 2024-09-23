// DatePickerInput.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';

const DatePickerInput = ({ selectedDate, onChange, placeholder, minData, style ,bookings }) => {
    const handleChange = (date) => {
        if (typeof onChange === 'function') {
            onChange(date);
        } else {
            console.error('onChange is not a function');
        }
    };
    
    // Устанавливаем минимальную дату с учетом сдвига
    const minDate = minData ? new Date(new Date().setDate(new Date().getDate() + minData)) : new Date();


    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) { // Увеличиваем дату на 1 день
            dates.push(new Date(date)); // Добавляем каждую дату в массив
        }
        return dates;
    };
    

    // Генерируем все занятые даты
    const bookedDates = bookings.flatMap(booking =>
        getDatesInRange(booking.data_start, booking.data_end)
    );

    return (
        <DatePicker
            autoComplete='off'
            selected={selectedDate || null} // Используем null, если selectedDate не передан
            onChange={handleChange}
            placeholderText={placeholder}
            dateFormat="yyyy-MM-dd"
            className="custom-datepicker"
            name='start-data'
            minDate={minDate}
            locale={ru}
            style={style} // Применение стиля, если передан
            excludeDates={bookedDates}  // Передаем занятые даты
        />
    );
};

DatePickerInput.propTypes = {
    selectedDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    minData: PropTypes.number, // Количество дней для смещения минимальной даты
    style: PropTypes.object,
};

DatePickerInput.defaultProps = {
    selectedDate: null, // По умолчанию дата не выбрана
    placeholder: 'Выберите дату',
    style: {},
};

export default DatePickerInput;
