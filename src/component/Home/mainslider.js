
import Carousel from 'react-bootstrap/Carousel';
import logoImage from '../../assets/images/download.jpg';



const MainSlider = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img src={logoImage} alt="slide1" className='w-100' />

        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={logoImage} alt="slide1" className='w-100' />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={logoImage} alt="slide1" className='w-100' />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default MainSlider;