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
      choices: [   //Ending or transitional point
         { text: "Try to escape", next: "deepcave" },
        { text: "Wait and observe", next: "listen" }
    ] 
    },
    listen: {
      id: "listen",
      text: "You hear rustling — something is out there.",
      choices: [
        { text: "Investigate the sound", next: "deepcave" },
        { text: "Run the other direction", next: "rockypath" }
      ]
    },
    deepcave: {
        id: "deepcave",
        text: "You wander deeper into the cave. It's eerily quiet.",
        choices: [
          { text: "Keep going", next: "undergroundlake" },
          { text: "Climb a rocky path", next: "rockypath" }
      ]
    },
      undergroundlake: {
        id: "undergroundlake",
        text: "You reach an underground lake glowing with an eerie light.",
        choices: [
          { text: "Swim across", next: "hiddenchamber" },
          { text: "Look for a boat", next: "boatdock" }
        ]
      },
      
      rockypath: {
        id: "rockypath",
        text: "The rocky path crumbles behind you. You're committed now.",
        choices: [
          { text: "Climb higher", next: "cliffledge" },
          { text: "Try to go back", next: "deadend" }
        ]
      },
      
      hiddenchamber: {
        id: "hiddenchamber",
        text: "You emerge into a chamber with glowing crystals.",
        choices: [
          { text: "Touch the crystals", next: "vision" },
          { text: "Hide and wait", next: "ambush" }
        ]
      },
      
      boatdock: {
        id: "boatdock",
        text: "You find a tiny, rickety boat barely floating.",
        choices: [
          { text: "Use the boat", next: "stormyride" },
          { text: "Repair the boat first", next: "fixboat" }
        ]
      },
      
      cliffledge: {
        id: "cliffledge",
        text: "You reach a narrow ledge overlooking a vast cavern.",
        choices: [
          { text: "Jump down", next: "softlanding" },
          { text: "Build a rope to climb", next: "escapeplan" }
        ]
      },
      
      deadend: {
        id: "deadend",
        text: "It's a dead end. Something is behind you...",
        choices: [
          { text: "Turn and face it", next: "monster" },
          { text: "Hide in the shadows", next: "sneakyescape" }
        ]
      },
      
      vision: {
        id: "vision",
        text: "The crystals show you a vision of the past.",
        choices: [
          { text: "Follow the vision", next: "mysticpath" },
          { text: "Break the crystals", next: "badending" }
        ]
      },
      
      ambush: {
        id: "ambush",
        text: "Something enters the chamber. You hold your breath.",
        choices: [
          { text: "Attack first", next: "combat" },
          { text: "Stay hidden", next: "escapechamber" }
        ]
      },
      
      stormyride: {
        id: "stormyride",
        text: "The boat lurches into a storm underground!",
        choices: [
          { text: "Hold on tight", next: "survivethefall" },
          { text: "Try to steer", next: "lostcurrent" }
        ]
      },
      theend: {
        id: "theend",
        text: " Congrats You made it out alive ",
        choices: []
      },
    }  

  
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



