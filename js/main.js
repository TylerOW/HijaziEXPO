document.addEventListener("DOMContentLoaded", () => {
    // Debounce function to optimize resize events
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    class Blob {
        constructor(el, options) {
            this.DOM = {};
            this.DOM.el = el;
            this.options = {};
            Object.assign(this.options, options);
            this.init();
        }
        init() {
            this.rect = this.DOM.el.getBoundingClientRect();
            this.descriptions = [];
            this.layers = Array.from(this.DOM.el.querySelectorAll('path'), t => {
                t.style.transformOrigin = `${this.rect.left + this.rect.width / 2}px ${this.rect.top + this.rect.height / 2}px`;
                t.style.opacity = 0; // Ensure blobs are initially hidden
                this.descriptions.push(t.getAttribute('d'));
                return t;
            });
        }
        intro() {
            anime.remove(this.layers);
            anime({
                targets: this.layers,
                duration: 1800,
                delay: (t, i) => i * 120,
                easing: [0.2, 1, 0.1, 1],
                scale: [0.5, 1], // Adjusted scale for smoother animations
                opacity: {
                    value: [0, 1],
                    duration: 600,
                    delay: (t, i) => i * 100,
                    easing: 'linear'
                }
            });
        }
    }

    const preloader = document.getElementById("preloader");
    const contentWrapper = document.getElementById("content-wrapper");
    const blobsContainer = document.querySelector('svg.scene');
    let blobs = [];

    // Function to initialize and animate blobs
    const initializeBlobs = () => {
        blobs = Array.from(blobsContainer.querySelectorAll('g')).map(el => new Blob(el));
        blobs.forEach(blob => blob.intro());
    };

    // Function to fade in the rest of the content
    const fadeInContent = () => {
        const otherContent = document.querySelectorAll('.fade-in-content'); // All elements with fade-in-content class
        anime({
            targets: otherContent,
            duration: 1000,
            easing: 'easeOutQuad',
            opacity: [0, 1],
            translateY: [-20, 0], // Slight upward motion
        });
    };

    // Handle preloader fade out, website fade in, and blob animation
    const onPreloaderDone = () => {
        preloader.style.display = "none"; // Remove preloader
        contentWrapper.style.opacity = "1"; // Fade in content wrapper
        initializeBlobs(); // Initialize blobs after preloader
        fadeInContent(); // Fade in additional content
    };

    // Wait for window load event
    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader.style.opacity = "0"; // Fade out preloader
            preloader.addEventListener("transitionend", onPreloaderDone);

            // Fallback in case `transitionend` doesn't fire
            setTimeout(onPreloaderDone, 550);
        }, 2000); // Delay to simulate loading
    });

    // Adjust blob positioning
    const blobPaths = document.querySelectorAll('svg.scene path');
    blobPaths.forEach(blob => {
        blob.style.transform = 'translate(-45px, -20px)'; // Move left 25px and up 50px
    });
});

