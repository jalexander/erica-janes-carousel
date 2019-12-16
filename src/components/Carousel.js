import { qs, $on } from '../helpers';

import horse1 from '../images/horse1.svg';
import horse2 from '../images/horse2.svg';
import horse3 from '../images/horse3.svg';
import horse4 from '../images/horse4.svg';

const svgList = [horse1, horse2, horse3, horse4];

class Carousel {
  constructor(size = 0) {
    this.size = size;
    this.carousel = qs('.carousel');
    this.horses = [];

    this.addItems();
    this.addListeners();
  }

  addListeners() {
    $on(this.carousel, 'click', this.handleCarouselClick.bind(this));
  }

  handleCarouselClick(event) {
    event.preventDefault();

    const playState = this.carousel.style.webkitAnimationPlayState;
    const isPlaying = !playState || playState === 'running';
    this.setPlayState(this.carousel, !isPlaying);

    this.horses.forEach(item => {
      this.setPlayState(item.firstChild, !isPlaying);
    });
  }

  setPlayState(el, isPlaying) {
    el.style.webkitAnimationPlayState = isPlaying ? 'running' : 'paused';
  }

  getRadius(itemWidth, itemCount) {
    return Math.round((itemWidth / 2) / Math.tan( Math.PI / itemCount));
  }

  addItems() {
    let svgCount = 0;

    const radius = this.getRadius(this.carousel.offsetWidth, this.size);
    const theta = 360 / this.size;

    for (let i = 0; i < this.size; i++) {
      let horse = document.createElement('div');
      horse.classList.add('carousel__item');
      horse.innerHTML = svgList[svgCount];
      horse.style.transform = `rotateY(${theta * i}deg) translateZ(${radius}px)`;
      this.horses.push(horse);
      this.carousel.appendChild(horse);
      svgCount++;

      if (svgCount >= svgList.length) {
        svgCount = 0;
      }
    }
  }
  
}

export default Carousel;