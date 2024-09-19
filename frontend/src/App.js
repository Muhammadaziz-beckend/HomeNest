import './App.css';
import Header from './components/header.jsx';
import NavBar from './components/nav-bar.jsx';
import Nav from './components/nav.jsx';
import Main from './main.jsx';
import DetailHome from './components/detail/homeDetail.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useRef } from 'react';
import Login from './auth/login.jsx'
import Register from './auth/register.jsx'
import History from './auth/components/history.jsx'
import SetPassword from './auth/components/set_password.jsx'
import AuthProfile from './auth/auth.jsx'

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
            <Main filters={filters} refHome={homesRef} />
          </>
        } />

        {/* auth */}
        <Route path='auth/' element={
          <>
            <AuthProfile />
          </>
        } />
        <Route path='auth/history/' element={
          <>
            <AuthProfile component={<History/>} />
          </>
        }/>
        <Route path='auth/set_password/' element={
          <>
            <AuthProfile component={<SetPassword/>} />
          </>
        }/>

        {/* login */}
        <Route path='auth/login/' element={
          <>
            <Login />
          </>
        } />
        <Route path='auth/register/' element={
          <>
            <Register />
          </>
        } />
        <Route path='/home/:id' element={<DetailHome />} />
      </Routes>
    </Router>
  );
}

export default App;
