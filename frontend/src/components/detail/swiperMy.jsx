import { useState } from "react";


const MySwiper = (props) => {
  const images = props.images.slice(0,5)
  const [mainImage, setMainImage] = useState(images[0].image)

  function setMainImageSrc(event) {

    setMainImage(event.target.src)
  }


  return (
    <>
      <div className='first'>
        <img src={mainImage} alt="" />
      </div>

      <div className='group'>

          {images.map(item => (
            <img onMouseMove={setMainImageSrc} src={item?.image} className={item?.image == mainImage ? 'activ' : ''} key={item?.id} />
          ))}

      </div>
    </>
  );
};

export default MySwiper;
