import logo from './../static/img/houseNest.png';
import fon from './../static/img/header-fon.png';
import fonBlack from './../static/img/Затемнение.png';
import './../static/css/style.css'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Header = (props) => {

    let [buttonClass, setButtonClass] = useState('hover')

    setInterval(
        () => buttonClass ? setButtonClass('') : setButtonClass('hover')
        , 1000)

    return (
        <header className="header">

            <div className="container">
                <div className="header-items">

                    <div className="start">
                        <NavLink to='/' className="logo">
                            {props.detail == true ? (<><h2 style={{ color: '#393939' }}>House<span>Nest</span></h2></>) : (<> <img src={logo} alt="" /> <h2 style={{ color: '#FFF' }}>House<span>Nest</span></h2></>)}
                        </NavLink>

                        <p className='comment'>
                            Экспресс-подбор <br />
                            жилья по самым низким ценам
                        </p>
                    </div>

                    <div className="menu">
                        {props.detail == true ? (<a style={{ color: 'black' }} href="tel:+996557230021">+(996) 557 230 021</a>) : (<a href="tel:+996557230021">+(996) 557 230 021</a>)}

                        <NavLink to="auth/login/" className={'login ' + buttonClass}>
                            Войти
                        </NavLink>
                    </div>

                </div>
            </div>

            {props.detail == true ? '' : (<div className="fon">
                <img src={fon} alt="" className='Fon' />
                <img src={fonBlack} className="black-fon"></img>
            </div>
            )}

        </header>
    )
}


export default Header