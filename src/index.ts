import NodeCache from "node-cache";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import config from './express.config'
import axios from "axios";

const cache = new NodeCache({ 
    stdTTL: 100, 
    checkperiod: 700,
    deleteOnExpire: true
});

const app = express();

app
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .get('/', async (req: Request, res: Response) => {
        // checks if the cache exists, if yes, returns data from the cache. else return data from API
        if(cache.has(config.CACHE_NAME)) {
            console.log('Using Cache');
            return res.send(cache.get(config.CACHE_NAME));
        } else {
            const response = await axios.get(config.URL);

            cache.set(config.CACHE_NAME, response.data);
            console.log('Getting data from the API');

            res.json(response.data);
        }
    })

    .post('/multiples_cache/create', (req: Request, res: Response) => {
        // create  multiple caches
        const data = req.body

        const author = {
            name: "Carlos Alves",
            github: "https://github.com/eucarlos",
            website: "https://carlosalves.vercel.app/"
        }

        cache.mset([
            { key: "data", val: data },
            { key: "author", val: author }
        ])

        return res.status(201).json({ data, author })
    })

    .get('/multiples_cache/show', (req: Request, res: Response) => {
        // show multiple caches
        const notFoundCache = {
            code: "404",
            message: "no cache found",
            _data: {}
        };

        const result = cache.mget(["data", "author"]);

        const hasCache = 
            Object.prototype.hasOwnProperty.call(result, 'data') 
            && Object.prototype.hasOwnProperty.call(result, 'author');

        if (!hasCache) return res.status(404).json(notFoundCache);

        return res.status(200).json({
            code: "200",
            message: "cache successfully found",
            _data: result
        })
    })

    .get('/stats', (req: Request, res: Response) => {
        // return cache stats: { hits, misses, keys, ksize, vsize }
        res.send(cache.getStats());
    })

    .listen(config.PORT, () => console.log(config.MESSAGE));
