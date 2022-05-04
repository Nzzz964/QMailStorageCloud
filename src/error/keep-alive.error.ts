export class KeepAliveError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}
