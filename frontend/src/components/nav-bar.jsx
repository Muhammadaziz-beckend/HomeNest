import img1 from './../static/img/komisia.png'
import img2 from './../static/img/Надежно.png'
import img3 from './../static/img/Гарантия.png'

const NavBar = () => {

    return (
        <div className="nav-bar">
            <div className="container">
                <div className="nav-bar-items">
                    <img src={img1} alt="" />
                    <img src={img2} alt="" />
                    <img src={img3} alt="" />
                </div>
            </div>
        </div>
    )

}



export default NavBar