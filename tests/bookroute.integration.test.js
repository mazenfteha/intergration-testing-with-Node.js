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
})
