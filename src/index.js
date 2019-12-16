import './main.css';

import { $on } from './helpers';
import Carousel from './components/Carousel';


const carouselSize = 16;

$on(window, 'load', () => {
  new Carousel(carouselSize);
});
