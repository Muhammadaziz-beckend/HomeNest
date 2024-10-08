import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Axios_request from '../../../request/axios_request.jsx'; // Ваш метод запроса

export default function StandardImageList() {
  const [images, setImages] = React.useState([]); // Список превью изображений
  const [files, setFiles] = React.useState([]);   // Список файлов для отправки на бэкенд

  // Функция для добавления нового изображения
  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = {
        img: URL.createObjectURL(file), // Создаем URL для изображения для предварительного просмотра
        title: file.name,
      };
      setImages([...images, newImage]); // Добавляем изображение в состояние для отображения
      setFiles([...files, file]); // Добавляем файл в состояние для отправки
    }
  };

  // Функция для отправки данных на бэкенд
  const handleSubmitImages = async () => {
    const formData = new FormData(); // Используем FormData для отправки файлов
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file); // Добавляем каждый файл в FormData
    });

    console.log(formData,files);
    
    // try {
    //   const response = await Axios_request.post('http://127.0.0.1:8000/api/v1/upload-images/', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data', // Обязательно указываем multipart/form-data
    //     },
    //   });
    //   console.log(response.data);
    // } catch (error) {
    //   console.error('Ошибка при отправке изображений:', error);
    // }
  };

  return (
    <>
      {/* Поле для загрузки изображения */}
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-image"
        type="file"
        onChange={handleAddImage}
      />
      <label htmlFor="upload-image">
        <Button variant="contained" component="span">
          Добавить изображение
        </Button>
      </label>

      {/* Список изображений для предпросмотра */}
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {images.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Кнопка для отправки изображений на бэкенд */}
      <Button variant="contained" onClick={handleSubmitImages}>
        Отправить изображения
      </Button>
    </>
  );
}
