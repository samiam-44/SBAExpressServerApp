import express from 'express';
const router = express.Router();

let users = [];
let userId = 1;

//Route to create new user and name the cat
router.post('/', (req, res) => {
    const { username, petName } = req.body; //Grabs username or optional pet name from user

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const userId = users.length + 1; //ID increments every time a user is created

    const newUser = {
        id: userId,
        name: username,
        progress: ['start'], //Track story path
        ending: null //null because no ending has been reached
    };
    users.push(newUser);

    if(petName) {
        companions.push({
            id: companions.length + 1,
            name: petName, 
            userId: userId //connects pet to User
        });
    }
res. status(201).json({ message: 'User and pet created!', user: newUser }); //Tells frontend request went through successfully
})

//Updates user specific info like progress, ending using their ID
router.put('/:id', (req, res) => {
    const { id } = req.params; //extract the user ID from the url parameter
    const { progress, ending } = req.body; // extract updated data from the request body
    const user = users.find(u => u.id === parseInt(id)); // Find the user in the array using the ID(convert it to an integer)
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    //update users progress
    if (progress) user.progress = progress;
    //update users ending
    if (ending) user.ending = ending;
res.json({ message: 'User updated!', user});
});
// DELETE ROUTE- Remove a user
router.delete('/:id', (req, res) => {
    const { id } = req.params; //get user ID
    const index = users.findIndex(u => u.id === parseInt(id)); // Find index of the user in the array
    if (index === -1) {
        return res.status(404).json({ error: 'User not found'}); 
    }
    const deletedUser = users.splice(index, 1); //Removes the user from the array using splice and returns an array of deleted items 
    res.json({ message: 'User deleted', user: deletedUser[0] });
});

export default router;