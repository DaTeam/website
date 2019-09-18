(function (globalThis) {
    const config = {
        scrollTopThreshold: 350
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

        applySmoothScrolling(globalThis.document.querySelectorAll(selector), target => globalThis.document.querySelector(target.getAttribute('href')));
    }

    function applyScrollToTop(selector) {
        if (!selector) return;

        applySmoothScrolling(globalThis.document.querySelectorAll(selector), _target => globalThis.document.body);
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
            refreshTopButtonVisibility();
        };
    }

    function refreshTopButtonVisibility() {
        if (globalThis.document.body.scrollTop > config.scrollTopThreshold ||
            globalThis.document.documentElement.scrollTop > config.scrollTopThreshold) {
            refs.scrollTopElements.forEach(element => {
                element.style.display = "block";
            })
        }
        else {
            refs.scrollTopElements.forEach(element => {
                element.style.display = "none";
            });
        }
    }

})(this);
