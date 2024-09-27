import { NavLink } from 'react-router-dom';
import './../../../static/css/style.css'

const Header = () => {

    return (
        <>
            <header className="header">

                <div className="container">
                    <div className="header-items">

                        <div className="start">
                            <NavLink to='/' className="logo">
                                <h2 style={{ color: '#393939' }}>House<span>Nest</span></h2>
                            </NavLink>

                            <p className='comment'>
                                Экспресс-подбор <br />
                                жилья по самым низким ценам
                            </p>
                        </div>

                        <div className="menu_admin">
                            <NavLink to='/auth/landlord/'>Список домов</NavLink>
                            <NavLink to='list_orders/'>Список заказов</NavLink>
                            <NavLink to='create_house/'> Добавить жильё </NavLink>
                        </div>

                    </div>
                </div>

            </header>
        </>
    )
}


export default Header