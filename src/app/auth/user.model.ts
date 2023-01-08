export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string, // keep this private
        private _tokenExpirationDate: Date // keep this private
    ) {}

    // user can't override the value when we use the getter for prop access
    get token() {
        // check if it token is expired or not
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null
        }
        return this._token
    }
}