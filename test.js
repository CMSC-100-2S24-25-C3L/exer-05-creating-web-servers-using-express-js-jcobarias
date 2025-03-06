import needle from "needle";

needle.post('http://localhost:3000/add-book',
{bookName: `The Little Prince`, isbn: '978-0156012195', author: 'Antoine Saint-Exupery', yearPub: '1943'},
(err, res) => {
    console.log(res.body);
});

needle.get('http://localhost:3000/find-by-isbn-author?isbn=978-0-7475-3269-9&author=J.K+Rowling'
, (err, res) => {
    console.log(res.body);
});
needle.get('http://localhost:3000/find-by-author?author=J.K+Rowling'
    , (err, res) => {
        console.log(res.body);
});
    
