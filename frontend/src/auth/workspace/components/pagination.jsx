import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function BasicPagination({ page, cuntPage, setPage, refHome }) {
  // Обработчик изменения страницы
  const handleChange = (event, value) => {
    setPage(Number(value)); // Устанавливаем новую страницу
    if (refHome.current) {
      // Прокручиваем страницу к началу блока домов при смене страницы
      refHome.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {cuntPage > 1 && ( // Пагинация отображается только если больше 1 страницы
        <Stack style={{ margin: 'auto' }} spacing={2}>
          <Pagination
            count={cuntPage} // Общее количество страниц
            page={Number(page)} // Текущая страница
            onChange={handleChange} // Обработчик изменения страницы
            color="secondary" // Цвет пагинации
          />
        </Stack>
      )}
    </>
  );
}
