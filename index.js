(function (globalThis) {
    const config = {
        version: '0.1.1',
        scrollTopThreshold: 350,
        menuCollapsedThreshold: 150,
        contactFormSelector: '.contact-form',
        contactFormInputSelector: '.contact-form .input',
        jsOnlyClass: 'js-only',
        mobile: {
            menuTriggerElement: '.m-trigger-menu'
        },
        contactFormSubmitUrl: 'https://dateam.azurewebsites.net/api/SendContactForm?code=oXoHZbTGvahR7dSLVlaOV3vBApaBRLScOx99tktUb03qRa5H0qzAVg=='
    };

    const refs = {};

    const data = {
        mobileEnabled: false,
        mobileMenuOpened: false
    };

    globalThis.onload = (_event => {
        initialize();
    });

    function initialize() {
        globalThis.appVersion = config.version;

        removeJsFilteringCss();
        loadRefs();
        data.mobileEnabled = isMobile(navigator.userAgent || navigator.vendor || window.opera);

        // Scroll navigation
        applyAnchorScrolling('.anchor-link');

        if (!data.mobileEnabled) applyScrollToTop('.link-to-top');
        else applyMobileMenuBehavior();

        applyOnScrollBehavior();

        // Display
        refreshHeaderMode();

        // Form
        applyContactFormBehavior();
    }

    function removeJsFilteringCss() {
        [...globalThis.document.querySelectorAll('.' + config.jsOnlyClass)].forEach(item => item.classList.remove(config.jsOnlyClass));
    }

    function loadRefs() {
        refs.scrollTopElements = [...globalThis.document.querySelectorAll('.link-to-top')];
        refs.formInputElements = [...globalThis.document.querySelectorAll(config.contactFormInputSelector)];
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
                data.mobileMenuOpened = false;
                refreshMobileMenu();
            });
        });
    }

    function applyMobileMenuBehavior() {
        globalThis.document.body.classList.add('m');

        const mobileMenuElement = globalThis.document.querySelector(config.mobile.menuTriggerElement);

        if (mobileMenuElement) {
            mobileMenuElement.addEventListener('click', () => {
                data.mobileMenuOpened = !data.mobileMenuOpened;
                refreshMobileMenu();
            });
        }
    }

    function refreshMobileMenu() {
        if (data.mobileMenuOpened) globalThis.document.body.classList.add('m-menu-opened');
        else globalThis.document.body.classList.remove('m-menu-opened');
    }

    function applyOnScrollBehavior() {
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
        const form = globalThis.document.querySelector(config.contactFormSelector);

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

        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        fetch(config.contactFormSubmitUrl, {
            headers,
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(() => {
                alert('Merci pour votre message, celui-ci a bien été envoyé et nous reviendrons vers vous dès que possible.');
                clearContactFormInputs();
            })
            .catch(err => {
                console.warn(err.message);
                alert('Merci pour votre message, cependant une erreur est survenue lors de l\'envoi.');
            });
    }

    function isMobile(agent) {
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0, 4)));
    }

    function clearContactFormInputs() {
        refs.formInputElements.forEach(input => {
            input.value = '';
        });
    }

})(this);