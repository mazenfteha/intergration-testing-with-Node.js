const express = require('express')
const router = express.Router();

const bookData = require('../data/books.json')
const {save} = require('../helper_functions/save')
const {check, validationResult} = require('express-validator')

//get all books
router.get('/', (req, res)=>{
    res.json(bookData)
})

//add book
router.post('/', 
    [
    check('name', 'Book name is required').not().isEmpty(),
    //check('author', 'Author name is required').not().isEmpty()
    ],  
    (req, res)=>{
        //in failure post
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //in success post
        const {name, author} = req.body
        bookData.push({
            name,
            author,
            id: Math.random(),
        })
        const isSaved = save(bookData)
        if(!isSaved){
            return res.status(500).json({
                errors: true,
                message:'could not save book'
            })
        }else{
            return res.status(200).json({
                message: 'Success'
            })
        }
})

//update book by id
router.put('/:bookid', (req,res)=>{
    const {bookid} = req.params;
    const {name, author} = req.body;

    const foundBook = bookData.find((book) => book.id == bookid);

    //in failure update
    if(!foundBook) {
        return res.status(404).send({
            errors: true,
            message: 'Book not found'
        });
    }
    //in success ubdate
    let ubdatedBook = null;
    const ubdatedBooks = bookData.map((book) => {
        if(book.id == bookid){
            ubdatedBook = {
                ...book,
                name,
                author
            }
            return ubdatedBook
        }
        return book
    });
    const isSaved = save(ubdatedBooks);
    if(!isSaved) {
        return res.status(500).json({
            error:true,
            message:'could not save book'
        });
    }
    res.status(201).json(ubdatedBook)

})

module.exports = router;