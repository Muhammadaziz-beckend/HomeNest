import { NavLink } from 'react-router-dom';

const Header = () => {

    return (
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

                    <div className="menu">
                        <a style={{ color: 'black' }} href="tel:+996557230021">+(996) 557 230 021</a>
                    </div>

                </div>
            </div>

        </header>
    )
}


export default Header