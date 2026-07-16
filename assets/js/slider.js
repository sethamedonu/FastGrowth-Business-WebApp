class Slider {
  constructor(selector) {
    this.el     = document.querySelector(selector);
    if (!this.el) return;
    this.slides = this.el.querySelectorAll('.slide');
    this.dots   = this.el.querySelectorAll('.dot');
    this.current = 0;
    this.timer   = null;
    this.init();
  }

  init() {
    this.show(0);
    this.el.querySelector('.slider-prev')?.addEventListener('click', () => this.prev());
    this.el.querySelector('.slider-next')?.addEventListener('click', () => this.next());
    this.dots.forEach((d, i) => d.addEventListener('click', () => this.show(i)));
    this.autoplay();
  }

  show(index) {
    this.slides.forEach((s, i) => s.classList.toggle('active', i === index));
    this.dots.forEach((d, i) => d.classList.toggle('active', i === index));
    this.current = index;
  }

  next() { this.show((this.current + 1) % this.slides.length); this.autoplay(); }
  prev() { this.show((this.current - 1 + this.slides.length) % this.slides.length); this.autoplay(); }

  autoplay() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.next(), 5000);
  }
}

new Slider('.hero-slider');
