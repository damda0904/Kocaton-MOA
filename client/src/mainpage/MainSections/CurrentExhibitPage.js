import React from 'react'
import '../Mainpage.css'
// import Slider from '@bit/akiran.react-slick.slider';
import AliceCarousel from 'react-alice-carousel';

function CurrentExhibitPage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
      };
    return (
        <div   style={{backgroundColor:"#D1ECEF",backgroundSize:"100%",height:"100vh",marginTop:"250px"}}>
            <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
				
        
        <AliceCarousel>
          <div>
            <h3 className="maincurrentextesth3">1</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">2</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">3</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">4</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">5</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">6</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">7</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">8</h3>
          </div>
          <div>
            <h3 className="maincurrentextesth3">9</h3>
          </div>
        </AliceCarousel>
        </div>
    )
}

export default CurrentExhibitPage
