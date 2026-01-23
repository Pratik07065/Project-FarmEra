
import NavScrollExample from '../navbar'

import Carousel from 'react-bootstrap/Carousel';
import './header.css';


export default function Header() {
  return (
    <div>
        <NavScrollExample/>
        <DarkVariantExample/>
    </div>
  )
}

function DarkVariantExample() {
  return (
   
    <Carousel data-bs-theme="dark" className='padi'>
      <Carousel.Item>
        <img
          className="d-block w-100 cursor-img"
          src="https://wallpapers.com/images/hd/organic-farming-1162-x-700-wallpaper-snmzav3nv42lgclu.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h1>First slide label</h1>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 cursor-img"
          src="https://images.pexels.com/photos/221016/pexels-photo-221016.jpeg?cs=srgb&dl=pexels-blooddrainer-221016.jpg&fm=jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1>Second slide label</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 cursor-img"
          src="https://ajaybiotech.com/images/banner-blog-agriculture-mobile.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1>Third slide label</h1>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>

  );
}
