import { beforeEach, describe, expect, it } from 'vitest';

import page from '../index.html?raw';
import Carousel from '../src/components/Carousel.js';

const markup = new DOMParser().parseFromString(page, 'text/html').body.innerHTML;

const ring = () => document.querySelector('.carousel');
const toggle = () => document.querySelector('.carousel-controls__toggle');
const horses = () => [...document.querySelectorAll('.carousel__item > svg')];
const playStates = () => horses().map(horse => horse.style.animationPlayState);
const click = el => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));

beforeEach(() => {
  document.body.innerHTML = markup;
});

describe('building the ring', () => {
  it('adds one item per requested size, cycling through the four horses', () => {
    new Carousel(6);

    expect(document.querySelectorAll('.carousel__item')).toHaveLength(6);
    expect(new Set(horses().map(horse => horse.innerHTML)).size).toBe(4);
  });

  it('gives every item its own angle', () => {
    new Carousel(4);

    const items = [...document.querySelectorAll('.carousel__item')];
    expect(new Set(items.map(item => item.style.transform)).size).toBe(4);
  });

  it('sizes the radius so items meet edge to edge', () => {
    expect(new Carousel(4).getRadius(200, 4)).toBe(100);
  });

  it('rejects sizes where the ring geometry degenerates', () => {
    expect(() => new Carousel(2)).toThrow(RangeError);
    expect(() => new Carousel()).toThrow(RangeError);
  });

  it('hides the decorative horses from assistive tech', () => {
    new Carousel(4);

    expect(horses().every(horse => horse.getAttribute('aria-hidden') === 'true')).toBe(true);
  });
});

describe('play/pause', () => {
  it('leaves the svg as the first child of each item', () => {
    new Carousel(4);

    for (const item of document.querySelectorAll('.carousel__item')) {
      expect(item.firstChild.nodeName).toBe('svg');
    }
  });

  it('pauses the ring and every horse together', () => {
    new Carousel(4);

    click(horses()[0]);

    expect(ring().style.animationPlayState).toBe('paused');
    expect(playStates()).toEqual(['paused', 'paused', 'paused', 'paused']);
  });

  it('resumes everything on the next click', () => {
    new Carousel(4);

    click(horses()[0]);
    click(horses()[0]);

    expect(ring().style.animationPlayState).toBe('running');
    expect(playStates()).toEqual(['running', 'running', 'running', 'running']);
  });

  it('toggles from the button as well as the carousel', () => {
    new Carousel(4);

    click(toggle());
    expect(ring().style.animationPlayState).toBe('paused');

    click(horses()[0]);
    expect(ring().style.animationPlayState).toBe('running');
  });

  it('keeps the accessible name of the icon button in step', () => {
    new Carousel(4);

    expect(toggle().getAttribute('aria-label')).toBe('Pause');
    expect(toggle().classList.contains('is-paused')).toBe(false);

    click(toggle());

    expect(toggle().getAttribute('aria-label')).toBe('Play');
    expect(toggle().classList.contains('is-paused')).toBe(true);
  });
});
