//---------IMPORTS
import express from 'express';
import userRoutes from './ROUTES/users.mjs'
import { storySteps } from './ROUTES/story.mjs';
import choiceRoutes from './ROUTES/choices.mjs';


const app = express();
const PORT = 3000 || 3001;

//Views 
app.set('view engine', 'pug');
app.set('views', './views');


//----------MIDDLEWARE
app.use(express.json()); //Parse incoming Json
app.use(express.static('public')); //Serve static files (HTML and CSS)from "public" folder
app.use((req, res, next) => { //Logs every request to the server
    console.log(`[LOG] ${req.method} ${req.url}`); //Logs the http method and URL
    next(); //Call the next middleware or route handler
});
    //logs the current time of every incoming request
    app.use((req, res, next) => {
    //creates a timestamp in ISO format EXAMPLE(2025-04-19T20:34:23.456Z)
        const timestamp = new Date().toISOString();
        console.log(`[TIME] ${timestamp}`);
        next();
});
// ------------ROUTES
app.use('/users', userRoutes); //connects user routes to /users
app.use('/choices', choiceRoutes); 

app.get('/choose', (req, res) => {
    res.render('choiceForm');
  });
  app.get('/profile/:name', (req, res) => {
    const { name } = req.params; // the user's name from the URL
    const user = user.find(u => u.name === name); // Find the user by name

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.render('profile', { user }); // Render profile page with the user data
});

  
  
//app.get('/', (req, res) => {
//  res.send('Hello');
//})

// This route sends back the story step
app.get('/api/steps/:id', (req, res) => { //Pulls matching step from the stroySteps object and sends it back as JSON
    const step = storySteps[req.params.id];
    if (!step) {
        return res.status(404).json({ error: 'Step not found' });
    }
    res.json(step); //send story step as JSON
});
//----------ERROR HANDLING MIDDLE WARE
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack); //logs full error stack for easy debugging
res.status(500).json({ error: 'Server failed.'});
});


//----------START SERVER LISTENER

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});



