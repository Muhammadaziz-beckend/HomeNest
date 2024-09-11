import './App.css';
import Header from './components/header.jsx';
import NavBar from './components/nav-bar.jsx';
import Nav from './components/nav.jsx';
import Main from './main.jsx';
import DetailHome from './components/detail/homeDetail.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState,useRef } from 'react';

function App() {
  const [filters, setFilters] = useState({
    city: '',
    region: '',
    roomType: ''
  });

  // Реф для элемента homes
  const homesRef = useRef(null);

  // Функция для прокрутки к элементу homes
  const scrollToHomes = () => {
    if (homesRef.current) {
      homesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFiltersUpdate = (newFilters) => {
    setFilters(newFilters);
    scrollToHomes(); // Прокручиваем после обновления фильтров
  };

  

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            {/* Передаем функцию для обновления фильтров в Nav */}
            <Nav onFiltersUpdate={handleFiltersUpdate} />
            <NavBar />
            {/* Передаем текущие фильтры в Main */}
            <Main filters={filters} refHome={homesRef}/>
          </>
        } />
        <Route path='/home/:id' element={<DetailHome />} />
      </Routes>
    </Router>
  );
}

export default App;
