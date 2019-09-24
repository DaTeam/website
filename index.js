(function (globalThis) {
    const config = {
        scrollTopThreshold: 350,
        menuCollapsedThreshold: 150
    };

    const refs = {};

    globalThis.onload = (event => {
        initialize();
    });

    function initialize() {
        loadRefs();

        applyAnchorScrolling('.anchor-link');
        applyScrollToTop('.link-to-top');
        applyOnScrollBehaviour();
    }

    function loadRefs() {
        refs.scrollTopElements = [...globalThis.document.querySelectorAll('.link-to-top')];
    }

    function applyAnchorScrolling(selector) {
        if (!selector) return;

        applySmoothScrolling(globalThis.document.querySelectorAll(selector), target => {
            console.log(target);

            console.log(globalThis.document.querySelector(target.getAttribute('href')));
            return globalThis.document.querySelector(target.getAttribute('href'));
        });
    }

    function applyScrollToTop(selector) {
        if (!selector) return;

        
        applySmoothScrolling(globalThis.document.querySelectorAll(selector), _target => {
            console.log('top');
            return globalThis.document.body;
        });
    }

    function applySmoothScrolling(elements, getTargetFn) {
        elements.forEach(anchorLink => {
            anchorLink.addEventListener('click', function (event) {
                event.preventDefault();

                getTargetFn(this).scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function applyOnScrollBehaviour() {
        globalThis.onscroll = () => {
            // refreshTopButtonVisibility();
            refreshHeaderMode();
        };
    }

    function refreshHeaderMode() {
        if (globalThis.document.body.scrollTop > config.menuCollapsedThreshold ||
            globalThis.document.documentElement.scrollTop > config.menuCollapsedThreshold) {
            globalThis.document.body.classList.add('scroll')
        }
        else {
            globalThis.document.body.classList.remove('scroll')
        }
    }

    // function refreshTopButtonVisibility() {
    //     if (globalThis.document.body.scrollTop > config.scrollTopThreshold ||
    //         globalThis.document.documentElement.scrollTop > config.scrollTopThreshold) {
    //         refs.scrollTopElements.forEach(element => {
    //             element.style.display = "block";
    //         })
    //     }
    //     else {
    //         refs.scrollTopElements.forEach(element => {
    //             element.style.display = "none";
    //         });
    //     }
    // }

})(this);
