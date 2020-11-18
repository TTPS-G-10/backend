class MissingAuthorizationError extends Error {
    token: string | undefined;
    constructor(token: string | undefined) {
        super();
        this.token = token;
    }
}
export default MissingAuthorizationError