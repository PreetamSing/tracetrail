import path from 'path'
import cors from 'cors'
import express, { Request, Response } from 'express'
import { Paginator } from './pagination.helper';
import { encrypt, decrypt } from 'text-encrypter'


const shift = 1;
const ignoreSpecialCharacters = false;

export default function (params: any) {

    const {
        MONGO_MODEL
    } = params

    const app = express()
    app.use(cors())

    app.use(express.static(path.join(__dirname, '../../ui')))

    // Handle requests to the sub-route
    app.get('/', (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../ui', 'index.html'));
    });

    app.get('/api/requests', async (req: Request, res: Response) => {

        let payload: any = req.body.decrypt()



        const {
            startIndex = 0,
            itemsPerPage = 10,
        } = payload

        const paginatorResult = await Paginator.Paginate({
            model: MONGO_MODEL,
            startIndex: +startIndex,
            itemsPerPage: +itemsPerPage,
            sort: {
                _id: -1
            }
        })

        let result: any = encrypt(JSON.stringify(paginatorResult), shift, ignoreSpecialCharacters);

        return res.json({
            message: 'Requests fetched successfully.',
            data: result
        })
    })

    return app
}