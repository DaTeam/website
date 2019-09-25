(function (globalThis) {
    const config = {
        scrollTopThreshold: 350,
        menuCollapsedThreshold: 150
    };

    const refs = {
        CONTACT_FORM_SELECTOR: '.contact-form',
        CONTACT_FORM_INPUT_SELECTOR: '.contact-form .input'
    };

    globalThis.onload = (event => {
        initialize();
    });

    function initialize() {
        loadRefs();

        // Scroll navigation
        applyAnchorScrolling('.anchor-link');
        applyScrollToTop('.link-to-top');
        applyOnScrollBehaviour();

        // Display
        refreshHeaderMode();

        // Form
        applyContactFormBehavior();
    }

    function loadRefs() {
        refs.scrollTopElements = [...globalThis.document.querySelectorAll('.link-to-top')];
        refs.formInputElements = [...globalThis.document.querySelectorAll(refs.CONTACT_FORM_INPUT_SELECTOR)];
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
            refreshHeaderMode();
        };
    }

    function refreshHeaderMode() {
        if (globalThis.document.body.scrollTop > config.menuCollapsedThreshold ||
            globalThis.document.documentElement.scrollTop > config.menuCollapsedThreshold) {
            globalThis.document.body.classList.add('scroll');
        }
        else {
            globalThis.document.body.classList.remove('scroll');
        }
    }

    function applyContactFormBehavior() {
        const form = globalThis.document.querySelector(refs.CONTACT_FORM_SELECTOR);

        if (form) {
            form.addEventListener('submit', onContactSubmit)
        }

        refs.formInputElements.forEach(input => {
            input.addEventListener("change", onContactInputChange);
        });
    }

    function onContactInputChange(event) {
        const { target } = event;
        const { value } = target;

        if ((typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]') && value.trim().length > 0) {
            target.classList.remove('empty');
        }
        else target.classList.add('empty');
    }

    function onContactSubmit(event) {
        event.preventDefault();

        const formData = refs.formInputElements.reduce((acc, element) => {
            acc[element.name] = element.value;

            return acc;
        }, {});

        console.log(formData);
    }

})(this);
