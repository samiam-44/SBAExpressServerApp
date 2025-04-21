import express from 'express'
const router = express.Router();

const userChoices = {} //object to store user choices

router.post('/', (req, res) => {
    const { userName, step, choice } = req.body;//Take needed info from the request body
   
    if (!userChoices[userName]) { //array for new user
        userChoices[userName] = [];
    }
    userChoices[userName].push({ step, choice });//step and choices user made gets stored

    res.status(201).json({ message: "Choice recorded successfully!"});
});

//GET route to look for what the user chose during the "game".
router.get('/:name', (req, res) => {
    const { name } = req.params //Grabs the users name from url
    // look up all choices for player
    const choices = userChoices[name];
     
    if (!choices) {
        return res.status(404).json({ error: "No choices found for this user or user not found" })
    }
    res.json({ userName: name, choices });
});
router.get('/', (req, res) => {
    const allChoices = Object.entries(userChoices).flatMap(([userName, choices]) =>
      choices.map(choice => ({ userName, ...choice }))
    );
    res.json({ choices: allChoices });
  });
  
  
//PUT to update a choice by what step it was made at
router.put('/:name/:step', (req, res) => {
    const { name, step } = req.params;
    const { newChoice } = req.body;

    //check if player exists
    const choices = userChoices[name];
    if (!choices) {
        return res.status(404).json({ error: "User not found"});

    }
    //Find the specific step 
    const choiceToUpdate = choices.find(c => c.step == step);
    if (!choiceToUpdate) {
        return res.status(404).json({ error: "Step not found for this user"})
    }

    //update choice
    choiceToUpdate.choice = newChoice;
    res.json({ message: "Choice updated", updated: choiceToUpdate });
});

//Delete-- Remove all choices for the user 
router.delete('/:name', (req, res) => {
    const { name } = req.params;

    if (!userChoices[name]) {
        return res.status(404).json({ error: "User not found" });
    }

    // Delete the users choices
    delete userChoices[name];
    res.json({ message: `All choices deleted for ${name}` });
});







export default router;