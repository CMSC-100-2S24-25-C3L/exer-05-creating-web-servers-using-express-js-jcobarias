
import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/add-book', (req, res) => {
    console.log("Request Body:", req.body);
    const {bookName, isbn, author, yearPub} = req.body;

    if(bookName.length == null || isbn == null || author == null || yearPub == null){
        return res.send({success: false});
    }

    fs.readFile("books.txt", 'utf8', (err, data) =>{
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
            if(isbn === bookData[1]){
                return res.send({success:false});
            }
        }

        fs.appendFile('books.txt', `${bookName},${isbn},${author},${yearPub} \n`, (err)=>{
            if (err) {
                console.error("Error writing to file:", err);
                return res.send({ success: false });
            }
            res.send({ success: true });
        })

    })
})

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})