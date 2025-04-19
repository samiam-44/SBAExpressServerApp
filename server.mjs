//---------IMPORTS
import express from 'express';

const app = express();
const PORT = 3000 || 3001;

//----------MIDDLEWARE
app.use(express.json()); //Parse incoming Json
app.use(express.static('public')); //Serve static files (HTML and CSS)from "public" folder
app.use((req, res, next) => { //Logs every request to the server
    console.log(`[LOG] ${req.method} ${req.url}`); //Logs the http method and URL
    next(); //Call the next middleware or route handler
});
// ------------ROUTES
//app.get('/', (req, res) => {
  //  res.send('Hello');
//})
//Filler story data
const storySteps = {
    start: {
      id: "start",
      text: "You wake up in a dark forest. What do you do?",
      choices: [
        { text: "Walk toward the strange light", next: "light" },
        { text: "Stay still and listen", next: "listen" }
      ]
    },
    light: {
      id: "light",
      text: "The light was a trap. You’re captured!",
      choices: [] //Ending or transitional point
    },
    listen: {
      id: "listen",
      text: "You hear rustling — something is out there.",
      choices: []
    }
  };
  
  // This route sends back the story step
  app.get('/api/steps/:id', (req, res) => { //Pulls matching step from the stroySteps object and sends it back as JSON
    const step = storySteps[req.params.id];
    if (!step) {
      return res.status(404).json({ error: 'Step not found' });
    }
    res.json(step); //send story step as JSON
  });
  

//----------START SERVER LISTENER

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});



