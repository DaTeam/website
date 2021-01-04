(function (globalThis) {
    const config = {
        formSelector: '.contact-form',
        onRequest: () => true,
        onSuccess: () => { },
        onError: () => { },
        onSettled: () => { },
        recaptchaKey: 'g-recaptcha-response',
        formSubmitUrl: 'https://dateam.azurewebsites.net/api/SendContactForm?code=oXoHZbTGvahR7dSLVlaOV3vBApaBRLScOx99tktUb03qRa5H0qzAVg=='
    };

    let submittingForm = false;

    function initialize(options) {
        // Checks provided options for config
        if (!!options && typeof options === 'object') {
            const optionProps = Object.keys(options);

            if (optionProps.indexOf('formSelector') >= 0 && isString(config.formSelector) && config.formSelector.length > 0) {
                config.formSelector = options.formSelector;
            }

            if (optionProps.indexOf('onRequest') >= 0 && isFunction(config.onRequest)) {
                config.onRequest = options.onRequest;
            }

            if (optionProps.indexOf('onSuccess') >= 0 && isFunction(config.onSuccess)) {
                config.onSuccess = options.onSuccess;
            }

            if (optionProps.indexOf('onError') >= 0 && isFunction(config.onError)) {
                config.onError = options.onError;
            }

            if (optionProps.indexOf('onSettled') >= 0 && isFunction(config.onSettled)) {
                config.onSettled = options.onSettled;
            }
        }

        // Apply form behaviour
        const form = globalThis.document.querySelector(config.formSelector);

        if (form) form.addEventListener('submit', onContactSubmit);
    }

    function onContactSubmit(ev) {
        ev.preventDefault();

        if (submittingForm) return cancelSubmit('submit in progress');
        if (!config.onRequest()) return cancelSubmit('aborted by consumer');

        const formData = new FormData(ev.target);
        const requestData = [...formData.entries()].reduce((acc, entry) => {
            let [key, value] = entry;

            if (key === config.recaptchaKey) key = 'recaptcha';

            acc[key] = value;

            return acc;
        }, {});

        if (!isString(requestData.recaptcha) || requestData.recaptcha.trim().length === 0) {
            return cancelSubmit('recaptcha is not valid');
        }

        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        submittingForm = true;
        fetch(config.formSubmitUrl, {
            headers,
            method: 'post',
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                config.onSuccess();
            })
            .catch(err => {
                config.onError(err);
            })
            .finally(() => {
                submittingForm = false;
                config.onSettled();
            });
    }

    function cancelSubmit(msg) {
        config.onError(new Error(msg));
        config.onSettled();
    }

    function isString(arg) {
        return typeof arg === 'string';
    }

    function isFunction(arg) {
        return ['[object Function]', '[object AsyncFunction]'].indexOf(Object.prototype.toString.call(arg)) >= 0;
    }

    globalThis.applyDaContact = initialize;
})(this);