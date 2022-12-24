require("dotenv").config()

class ExpressConfig {
    public PORT: number | string;
    public MESSAGE: string;
    public URL: string;
    public CACHE_NAME: string

    constructor() {
        this.PORT = process.env.PORT || 8001;
        this.MESSAGE = `Listening on port: ${this.PORT}`;
        this.URL = process.env.CACHE_URL;
        this.CACHE_NAME = process.env.CACHE_NAME || 'cache';
    }
}

export default new ExpressConfig;