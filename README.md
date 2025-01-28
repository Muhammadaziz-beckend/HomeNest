# Аренда дома (House Rental)

## Описание
HouseNest - это веб-приложение для удобного управления арендой жилья. Пользователи могут находить подходящие дома, бронировать их, а владельцы — сдавать в аренду через удобный интерфейс.

## Функции
### Поиск жилья:

По фильтрам: цена, местоположение, количество комнат и т. д.
Сортировка по цене или рейтингу.
Управление бронированием:

Бронирование доступных дат.
Просмотр деталей аренды.
Для владельцев:

Добавление объявлений о сдаче жилья.
Управление статусом бронирования.
Админ-панель:

Модерация пользователей.
Управление объявлениями.

## Технологии
### Backend: Django REST Framework
### Frontend: React.js
База данных: SQL
Docker: для контейнеризации приложения.
Swagger: для документации API.

## Установка и запуск
### 1.Клонируйте репозиторий:
``` copy
git clone https://github.com/Muhammadaziz-beckend/HomeNest
cd HomeNest
```

### Настройка Backend:
``` copy
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

``` copy
python manage.py migrate
```
``` copy
python manage.py runserver
```

### Настройка Frontend:
``` copy
npm install
```
``` copy
npm start
```
