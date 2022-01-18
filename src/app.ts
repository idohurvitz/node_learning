import express from 'express';
const port = 3001;
const hostname = 'localhost';

const app = express()
app.listen(port, () => console.log(`Running server on ${hostname}:${port}`))

app.get('/', (req, res) => {
    res.send('Hello world!');

}
)