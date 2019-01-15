class Carousel {
    constructor(el) {
        this.el = el;
        this.currentIndex = 0;
        this.slidesMargin = 0;
        this.initElements();
        this.initCarousel();
        this.listenEvents();
    }

    initElements() {
        this.elements = {
            prev: this.el.querySelector('[data-prev]'),
            next: this.el.querySelector('[data-next]'),
            slides: this.el.querySelector('.slides'),
        };
    }

    initCarousel() {
        this.initSlides();
        this.initSlidesClones();
        this.initTransition();
        this.setSlide(1);
    }

    initSlides() {
        this.slides = this.el.querySelectorAll('.slide');
        this.slidesAmount = this.slides.length;
    }

    initSlidesClones() {
        for (let i = 0; i < this.slidesAmount; i++) {
            const slideClone = this.slides[i].cloneNode(true);
            this.elements.slides.appendChild(slideClone);
        }
        const lastSlideClone = this.slides[this.slides.length - 1].cloneNode(true);
        this.elements.slides.insertBefore(lastSlideClone, this.slides[0]);
        this.slides = this.el.querySelectorAll('.slide');
    }

    initTransition() {
        const computedStyle = window.getComputedStyle(this.elements.slides);
        const transDuration = parseFloat(computedStyle.transitionDuration);
        const transDelay = parseFloat(computedStyle.transitionDelay);
        this.slidesAnimationDuration = transDuration + transDelay;
        this.animationIsOn = false;
    }

    listenEvents() {
        const prevBtnHandler = () => {
            if (this.animationIsOn) {
                return;
            }
            this.animationIsOn = true;

            const slideLeft = () => {
                this.slidesMargin += this.getSlideWidth(this.currentIndex);
                this.elements.slides.style.marginLeft = `${this.slidesMargin}px`;
                this.currentIndex--;
                setTimeout(() => {
                    this.animationIsOn = false;
                }, this.slidesAnimationDuration * 1000 + 40);
            }

            if (this.currentIndex <= 0) {
                this.elements.slides.classList.add('no-transition');
                this.setSlide(this.slidesAmount);
                setTimeout(() => {
                    this.elements.slides.classList.remove('no-transition');
                    slideLeft();
                }, 10);
                return;
            } 
            slideLeft();
        };

        const nextBtnHandler = () => {
            if (this.animationIsOn) {
                return;
            }

            this.animationIsOn = true;

            const slideRight = () => {
                this.slidesMargin -= this.getSlideWidth(this.currentIndex);
                this.elements.slides.style.marginLeft = `${this.slidesMargin}px`;
                this.currentIndex++;
                setTimeout(() => {
                    this.animationIsOn = false;
                }, this.slidesAnimationDuration * 1000 + 30);
            }

            if (this.currentIndex >= this.slidesAmount) {
                this.elements.slides.classList.add('no-transition');
                this.setSlide(0);
                setTimeout(() => {
                    this.elements.slides.classList.remove('no-transition');
                    slideRight();
                }, 10);
                return;
            } 

            slideRight();
        };
        this.elements.prev.addEventListener('click', prevBtnHandler);
        this.elements.next.addEventListener('click', nextBtnHandler);
    }

    getSlideWidth(index) {
        const slide = this.slides[index];
        const style = window.getComputedStyle(slide);
        const slideInnerSize = slide.getBoundingClientRect();
        return slideInnerSize.width
            + parseInt(style.marginLeft, 10)
            + parseInt(style.marginRight, 10);
    }

    setSlide(index) {
        let marginSift = 0;
        for (let i = 0; i < index; i++) {
            marginSift -= this.getSlideWidth(i);
        }
        this.slidesMargin = marginSift;
        this.currentIndex = index;
        this.elements.slides.style.marginLeft = `${this.slidesMargin}px`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel(document.querySelector('.carousel'));
    console.dir(carousel);
});
