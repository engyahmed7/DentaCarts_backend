export function catchAsync(fn) {
    return function (req, res, next) {
        // Check if the function is async and return the result.
        if (!fn || typeof fn !== 'function') {
            return next(new Error('Invalid handler function'));
        }

        // Call the async function and catch errors.
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}
