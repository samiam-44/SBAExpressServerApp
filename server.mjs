//---------IMPORTS
import express from 'express';

const app = express();
const PORT = 3000 || 3001;

//----------MIDDLEWARE
app.use(express.json()); //Parse incoming Json
app.use(express.static('public')); //Serve static files (HTML and CSS)from "public" folder
app.use((req, res) => { //logs method (GET, POST, etc.) and the request URL
    console.log(`[${req.method}] ${req.url}`);
})
// ------------ROUTES
app.get('/', (req, res) => {
    res.send('Hello');
})

//----------START SERVER LISTENER

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});



