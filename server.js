import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post('/add-book', (req, res) => { // POST method that adds an book (object) to books.txt
    console.log("Request Body:", req.body);
    const {bookName, isbn, author, yearPub} = req.body;

    if(bookName == null || isbn == null || author == null || yearPub == null){ // checks if their are missing fields
        return res.send({success: false});
    }

    if(!fs.existsSync('books.txt')){
        fs.writeFileSync('books.txt', '');
    }

    fs.readFile('books.txt', 'utf8', (err, data) =>{ // reads books.txt
        if (err) {
            if (err.code === "ENOENT") {
                console.error("File not found:", err.path);
            } else {
                console.error("Error reading file:", err);
            }
            return;
        }
        var books = [];
        if(data){
            var books = data.split("\n");
        }

        for(let i=0; i<books.length; i++){ //ensures if there is already an existing ISBN
            const bookData = books[i].split(",");
            if(isbn === bookData[1]){
                return res.send({success:false});
            }
        }

        fs.appendFile('books.txt', `${bookName},${isbn},${author},${yearPub} \n`, (err)=>{ // append the object to the text file
            if (err) {
                console.error("Error writing to file:", err);
                return res.send({ success: false });
            }
            res.send({ success: true });
        })

    })
})

app.get('/find-by-isbn-author', (req, res)=>{ // GET method that finds saved data by using isbn and author
    const {isbn, author} = req.query;

    if(isbn == null || author == null){ //checks if the request query has missing fields
        return res.send({success:false, message: "Missing ISBN or Author"})
    }
    
    if(!fs.existsSync('books.txt')){ // makes books.txt if it does not exist
        fs.writeFileSync('books.txt', '');
    }

    fs.readFile('books.txt', 'utf8', (err, data) =>{
        if (err) {
            if (err.code === "ENOENT") {
                console.error("File not found:", err.path);
            } else {
                console.error("Error reading file:", err);
            }
            return;
        }
        var books = [];
        if(data){
            var books = data.split("\n");
        }
        for(let i=0; i<books.length; i++){
            const bookData = books[i].split(",");

            if(isbn === bookData[1] && author=== bookData[2]){ // if there is a matching data saved it sends a response message containing the bookdata
                return res.send({
                    success: true,
                    book: {
                        bookName: bookData[0],
                        isbn: bookData[1],
                        author: bookData[2],
                        yearPub: bookData[3]
                    }
                })
            }
        }

        return res.send({success:false})
    })

})

app.get('/find-by-author', (req, res)=>{ // GET method for finding a saved data using the author
    const {author} = req.query;

    if(author == null){ 
        return res.send({success:false, message: "Missing Author"})
    }

    
    if(!fs.existsSync('books.txt')){
        fs.writeFileSync('books.txt', '');
    }

    fs.readFile('books.txt', 'utf8', (err, data) =>{
        if (err) {
            if (err.code === "ENOENT") {
                console.error("File not found:", err.path);
            } else {
                console.error("Error reading file:", err);
            }
            return;
        }
        var books = [];
        if(data){
            var books = data.split("\n");
        }

        const foundBooks = []; //initialized an empty array to store the found data that matches the author
        for(let i=0; i<books.length; i++){
            const bookData = books[i].split(",");

            if(author === bookData[2]){ // similar to find-by-isbn-author but this time only the author
                foundBooks.push({
                    bookName: bookData[0],
                    isbn: bookData[1],
                    author: bookData[2],
                    yearPub: bookData[3]
                })
            }
        }
        if(foundBooks.length > 0){
            return res.send({foundBooks});
        }
        else{
            return res.send({success:false})
        }
    })

})


app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})