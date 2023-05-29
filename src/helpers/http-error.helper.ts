import { StatusCode } from 'hono/utils/http-status';

/**
 * Creates a new HttpError
 * @class
 */
export default class HttpError extends Error {
    public status: StatusCode = 500;

    /**
     * Constructor options
     * @param {String} message - Error message
     * @param {StatusCode?} status - HTTP status code
     */
    constructor(message: string, status?: StatusCode) {
        super(message);

        this.status = !status ? 500 : status;
    }
}
