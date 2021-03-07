document.addEventListener("DOMContentLoaded", (event) => {

    const imagesListContainer = document.querySelector('.images-list');
    const spinner = document.querySelector('.spinner');
    const startBtn = document.querySelector('.start-btn');
    const errMsg = document.querySelector('.err-msg');
    const limit = 20; /* IMAGES PER PAGE */
    const className = {
        fadeIn: 'fadeIn',
        lazyLoading: 'lazy-loading',
        lastImg: 'last-img',
        hide: 'hide'
    }

    let start = 0; /* START FROM PAGE NUMBER */
    let firstInit = false;
    let lazyTargets;

    /* RUN APP ON CLICK */
    startBtn.addEventListener('click', (e) => {
        startBtn.classList.add(className.hide)
        spinner.classList.remove(className.hide);
        getImagesList();
    });

    /* GET LIST OF IMAGES */
    let getImagesList = () => {
        if (firstInit) {
            start += limit;
        } else {
            firstInit = true;
        }

        fetch(`https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${limit}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                spinner.classList.remove(className.hide);
                createNewImages(data)
            }).catch((err) => {
            errMsg.textContent = `Oops something went wrong!!!  Try again later.`
            startBtn.classList.remove(className.hide)
            spinner.classList.add(className.hide);
        })
    }

    /* CREATE NEW IMAGES WITH EMPTY SRC */
    let createNewImages = (list) => {
        list.forEach(el => {
            const img = document.createElement('img');

            img.width = 300;
            img.height = 250;
            img.dataset.lazyLoadUrl = el.url;
            img.classList.add(className.lazyLoading);
            imagesListContainer.appendChild(img);
        })

        /* ADD OBSERVER FOR EACH IMG */
        lazyTargets = document.querySelectorAll('.lazy-loading');

        /* ADD CLASS TO CHECK LAST IMG LOADED AND WE NEED TO GET NEW PACK OF IMAGES */
        lazyTargets[lazyTargets.length - 1].classList.add(className.lastImg);
        lazyTargets.forEach(lazyLoad);
    }

    /* FILL IMG SRC AND LOAD IMG */
    let lazyLoad = (target) => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    img.setAttribute('src', img.dataset.lazyLoadUrl);
                    img.classList.add(className.fadeIn);

                    if (img.classList.contains(className.lastImg)) {
                        spinner.classList.remove(className.hide);
                        img.classList.remove(className.lastImg);
                        getImagesList();
                    }

                    observer.disconnect();
                }
            });
        });
        observer.observe(target);
    }

});
