class ErrorBadRequest extends Error {
    constructor(...args : any) {
        super(...args);
        Error.captureStackTrace(this, ErrorBadRequest);
    }
};

export {
    ErrorBadRequest
};