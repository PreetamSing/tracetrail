import path from 'path'
import cors from 'cors'
import express, { Request, Response } from 'express'
import { Paginator } from './pagination.helper';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import http from 'http';


export default function (params: any) {

    const {
        MONGO_MODEL
    } = params


    const app = express()

    const server = http.createServer(app)
    const io = new Server(server)

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('message', (msg: string) => {
            console.log('message: ' + msg);

            io.emit('message', msg);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });


    app.use(express.static(path.join(__dirname, '../../ui')))

    // Handle requests to the sub-route
    app.get('/', (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../ui', 'index.html'))
    })





    app.get('/a', (req, res) => {
        const socket = req.socket;
        socket.write('HTTP/1.1 200 OK\r\n');
        socket.write('Content-Type: text/plain\r\n');
        socket.write('Connection: close\r\n');
        socket.write('\r\n');
        socket.write('Hello World!');
        socket.end();
    });






    // app.get('/api/requests', async (req: Request, res: Response) => {
    //     const {
    //         startIndex = 0,
    //         itemsPerPage = 10,
    //     } = req.query
    //     const result = await Paginator.Paginate({
    //         model: MONGO_MODEL,
    //         startIndex: +startIndex,
    //         itemsPerPage: +itemsPerPage,
    //         sort: {
    //             _id: -1
    //         }
    //     })
    //     return res.json({
    //         message: 'Requests fetched successfully.',
    //         ...result,
    //     })
    // })

    return app
}