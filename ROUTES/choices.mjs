import express from 'express'
const router = express.Router();

const playerChoices = {} //object to store player choices

router.post('/', (req, res) => {
    const { playerName, step, choice } = req.body;//Take needed info from the request body
   
    if (!playerChoices[playerName]) { //array for new player
        playerChoices[playerName] = [];
    }
    playerChoices[playerName].push({ step, choice });//step and choices user made gets stored

    res.status(201).json({ message: "Choice recorded successfully!"});
});

//GET route to look for what the user chose during the "game".
router.get('/:name', (req, res) => {
    const { name } = req.params //Grabs the users name from url
    // look up all choices for player
    const choices = playerChoices[name];
     
    if (!choices) {
        return res.status(404).json({ error: "No choices found for this user or user not found" })
    }
    res.json({ playerName: name, choices });
});





export default router;