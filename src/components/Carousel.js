import { qs, $on } from '../helpers';

import horse1 from '../images/horse1.svg?raw';
import horse2 from '../images/horse2.svg?raw';
import horse3 from '../images/horse3.svg?raw';
import horse4 from '../images/horse4.svg?raw';

// Parsed as XML, not via innerHTML: the HTML parser turns the files' `<?xml ?>`
// prolog into a comment node and buries the <svg> among its siblings.
function parseSvgTemplates(sources) {
  return sources.map(source => {
    const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;

    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    return svg;
  });
}

// The radius divides by tan(PI / count), which degenerates below 3.
const minItems = 3;

class Carousel {
  constructor(size) {
    if (!Number.isInteger(size) || size < minItems) {
      throw new RangeError(`Carousel needs at least ${minItems} items, got ${size}`);
    }

    this.size = size;
    this._carousel = qs('.carousel');
    this._toggle = qs('.carousel-controls__toggle');
    this.svgElements = [];
    this.isPlaying = true;

    const svgSources = [horse1, horse2, horse3, horse4];
    this._svgTemplates = parseSvgTemplates(svgSources);

    this.addItems();
    this.addListeners();
  }

  addListeners() {
    $on(this._carousel, 'click', () => this.togglePlayState());
    $on(this._toggle, 'click', () => this.togglePlayState());
  }

  dispose() {
    this._carousel.removeEventListener('click', () => this.togglePlayState());
    this._toggle.removeEventListener('click', () => this.togglePlayState());
  }

  togglePlayState() {
    this.isPlaying = !this.isPlaying;

    this.setPlayState(this._carousel, this.isPlaying);
    this.svgElements.forEach(svg => this.setPlayState(svg, this.isPlaying));

    this._toggle.classList.toggle('is-paused', !this.isPlaying);
    this._toggle.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
  }

  setPlayState(el, isPlaying) {
    el.style.animationPlayState = isPlaying ? 'running' : 'paused';
  }

  getRadius(itemWidth, itemCount) {
    if (itemCount <= 1 || itemWidth <= 0) return 0;
    return Math.round(itemWidth / 2 / Math.tan(Math.PI / itemCount));
  }

  addItems() {
    const radius = this.getRadius(this._carousel.offsetWidth, this.size);
    const theta = 360 / this.size;

    for (let i = 0; i < this.size; i++) {
      const horse = document.createElement('div');
      const svg = this._svgTemplates[i % this._svgTemplates.length].cloneNode(true);

      horse.classList.add('carousel__item');
      horse.style.transform = `rotateY(${theta * i}deg) translateZ(${radius}px)`;
      horse.appendChild(svg);

      // The <svg> carries the bobbing animation, so that is what pausing needs.
      this.svgElements.push(svg);
      this._carousel.appendChild(horse);
    }
  }
}

export default Carousel;
