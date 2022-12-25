import NodeCache from "node-cache";
import express, { Request, Response } from "express";
import config from './express.config'
import axios from "axios";

const cache = new NodeCache({ stdTTL: 10 });
const app = express();

app
    .get('/', async (req: Request, res: Response) => {
        if(cache.has(config.CACHE_NAME)) {
            console.log('Using Cache');
            return res.send(cache.get(config.CACHE_NAME))
        } else {
            const response = await axios.get(config.URL);

            cache.set(config.CACHE_NAME, response.data);
            console.log('Getting data from the API');

            res.json(response.data)
        }
    })

    .get('/stats', (req: Request, res: Response) => {
        res.send(cache.getStats())
    })

    .listen(config.PORT, () => console.log(config.MESSAGE))
