const express = require('express')
const request = require('supertest')
const bookRoute = require('../routes/books')

const app =express();   //fake app (;
app.use(express.json());
app.use("/api/books", bookRoute);

describe("Integration test for the books API", () => {

    it('GET /api/books - success -', async ()=>{
        const {body, statusCode} = await request(app).get('/api/books')

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    author: expect.any(String)
                })
            ])
        )
        expect(statusCode).toBe(200)
    })

    it('POST /api/books -faliure on invalid post body',async ()=>{
        const { body, statusCode} = await request(app).post('/api/books').send({
            name:'',
            author:'Dostoevsky'
        });
        console.log(body)

        expect(statusCode).toBe(400);
        expect(body).toEqual({
            errors: [
                {
                    location: 'body',
                    msg: 'Book name is required',
                    path: "name",
                    type: "field",
                    value: ''
                }
            ]
        })
    })

    it('POST /api/books - success', async ()=> {
        const {body, statusCode} = await request(app).post('/api/books').send({
            name:'crime and punishment',
            author:'Dostoevsky'
        });

        expect(statusCode).toBe(200);

        expect(body).toEqual({
            message: 'Success'
        })
    })

    it('PUT /api/books/:bookid - failure when book is not found' , async () => {
        const {body, statusCode } = await request(app).put('/api/books/5000').send({
            name:'crime and punishment',
            author:'Dostoevsky'
        });
        expect(statusCode).toBe(404);
        expect(body).toEqual({
            errors: true,
            message: 'Book not found'
        })
    })

    it('PUT /api/books/:bookid - success - Successfuly updated' , async () => {
        const {body, statusCode } = await request(app).put('/api/books/2').send({
            name:'Let him cook',
            author:'Walter white'
        });
        expect(statusCode).toBe(201);
        expect(body).toEqual({
            name:'Let him cook',
            author:'Walter white',
            id:2
        })
    })
})
