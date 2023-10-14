import express from 'express';
import data from './resource/members.json' assert { type: "json" };

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/images', express.static('image'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes

app.use((err, req, res, next) => {
console.error('An error occurred. '+err.stack);
res.status(500).send('An error occurred.');
});

app.listen(PORT, () => {
    console.log(`The server is listening to port ${PORT}`);
});
