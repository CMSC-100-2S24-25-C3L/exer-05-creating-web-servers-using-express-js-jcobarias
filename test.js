import needle from "needle";

needle.post('http://localhost:3000/add-book',
{bookName: 'Jacob & Friends', isbn: '978-0-7485-3269-8', author: 'J.K. Rowling', yearPub: '1997'},
(err, res) => {
    console.log(res.body);
});
