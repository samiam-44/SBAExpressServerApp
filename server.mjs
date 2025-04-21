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
    //logs the current time of every incoming request
    app.use((req, res, next) => {
    //creates a timestamp in ISO format EXAMPLE(2025-04-19T20:34:23.456Z)
        const timestamp = new Date().toISOString();
        console.log(`[TIME] ${timestamp}`);
        next();

    })
});
// ------------ROUTES
//app.get('/', (req, res) => {
//  res.send('Hello');
//})
//Route to create new user and name the cat
app.post('/api/users', (req, res) => {
    const { username, petName } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const userId = users.length + 1;

    const newUser = {
        id: userId,
        name: username,
        progress: ['start'],
        ending: null
    };
    users.push(newUser);

    if(petName) {
        companions.push({
            id: companions.length + 1,
            name: petName, 
            userId: userId
        });
    }
res. status(201).json({ message: 'User and pet created!', user: newUser });
})

//Updates user specific info like progress, ending using their ID
app.put('/api/users/:id', (req, res) => {
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
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params; //get user ID
    const index = users.findIndex(u => u.id === parseInt(id)); // Find index of the user in the array
    if (index === -1) {
        return res.status(404).json({ error: 'User not found'}); 
    }
    const deletedUser = users.splice(index, 1); //Removes the user from the array using splice and returns an array of deleted items 
    res.json({ message: 'User deleted', user: deletedUser[0] });
});


//--------STORY STEPS/ DATA CATEGORIES
const storySteps = {
    start: {
        id: "start",
        text: "It’s Day One of the outbreak. You and your cat, NEO, are holed up in your Seattle apartment. Sirens scream nonstop. The power just died. You hear gunshots outside.",
        choices: [
            { text: "Barricade the door", next: "barricade" },
            { text: "Grab NEO and run", next: "runout" }
        ]
    },

    barricade: {
        id: "barricade",
        text: "You flip your table and push it against the door. NEO growls low — unusual. Something is climbing your fire escape.",
        choices: [
            { text: "Peek out the window", next: "windowpeek" },
            { text: "Hide in the bathroom with NEO", next: "bathroomhide"},
            { text: "Start Over", next: "start" }
        ]
    },

    runout: {
        id: "runout",
        text: "You bolt down the hallway with NEO in your backpack. You see your neighbor — half his face is gone, and he's crawling toward you.",
        choices: [
            { text: "Kick him and keep running", next: "streetmadness" },
            { text: "Drag him inside and lock the door", next: "infectedtrap" },
            { text: "Start Over", next: "start" }
        ]
    },

    windowpeek: {
        id: "windowpeek",
        text: "A pale, eyeless creature screeches and smashes through the glass, slicing your chest open. NEO leaps onto its face.",
        choices: [
            { text: "Run while NEO fights", next: "fireescape" },
            { text: "Help NEO fight it", next: "fightmonster" },
            { text: "Start Over", next: "start" }
        ]
    },

    bathroomhide: {
        id: "bathroomhide",
        text: "You curl into the tub with NEO. Heavy steps enter your apartment. Something sniffs the air.",
        choices: [
            { text: "Stay silent", next: "safeescape" },
            { text: "Slam the door shut and fight", next: "bathroomfight" },
            { text: "Start Over", next: "start" }
        ]
    },

    infectedtrap: {
        id: "infectedtrap",
        text: "Too late. He bites your arm as you try to save him. You feel the infection start. You have minutes.",
        choices: [
            { text: "End it yourself", next: "tragicend" },
            { text: "Search his apartment for a cure", next: "desperatesearch" },
            { text: "Start Over", next: "start" }
        ]
    },

    streetmadness: {
        id: "streetmadness",
        text: "The city is chaos. Cars on fire. People screaming. A military truck stops beside you.",
        choices: [
            { text: "Get in", next: "quarantine" },
            { text: "Run into the woods", next: "forestentry" },
            { text: "Start Over", next: "start" }
        ]
    },

    fireescape: {
        id: "fireescape",
        text: "You scale the fire escape. NEO jumps back onto your shoulder, bleeding. The city burns below.",
        choices: [
            { text: "Climb to the roof", next: "roofsignal" },
            { text: "Jump onto the neighbor’s balcony", next: "balconytrap" },
            { text: "Start Over", next: "start" }
        ]
    },

    fightmonster: {
        id: "fightmonster",
        text: "You stab the thing in the eye with a kitchen knife. It shrieks and explodes into a cloud of spores.",
        choices: [
            { text: "Run outside coughing", next: "infectionpath" },
            { text: "Seal the windows and wait", next: "toxicchamber" },
            { text: "Start Over", next: "start" }
        ]
    },

    safeescape: {
        id: "safeescape",
        text: "The thing leaves. You sneak out hours later. You and NEO slip into the shadows, free… for now.",
        choices: [
            { text: "Head for the mountains", next: "forestentry" },
            { text: "Search for survivors", next: "survivorcamp" },
            { text: "Start Over", next: "start" }
        ]
    },

    bathroomfight: {
        id: "bathroomfight",
        text: "You smash the door into its face, but it grabs you by the throat. NEO rips into its neck. You crush its skull with the toilet lid.",
        choices: [
            { text: "Escape while it’s down", next: "fireescape" },
            { text: "Loot your apartment", next: "gearup" },
            { text: "Start Over", next: "start" }
        ]
    },

    tragicend: {
        id: "tragicend",
        text: "With tears in your eyes, you whisper goodbye to NEO and end it quickly. Your story ends here.",
        choices: [,
            { text: "Start Over", next: "start" }
        ]
    },

    desperatesearch: {
        id: "desperatesearch",
        text: "You find a syringe marked 'EXPERIMENTAL.' You inject it. Everything goes black...",
        choices: [
            { text: "Wake up", next: "mutation" },
            { text: "Let go", next: "tragicend" },
            { text: "Start Over", next: "start" }
        ]
    },

    militarytruck: {
        id: "militarytruck",
        text: "Inside the truck, soldiers aim guns at you. 'Bitten or clean?' one growls.",
        choices: [
            { text: "Lie: 'Clean.'", next: "quarantine" },
            { text: "Tell the truth", next: "executed" },
            { text: "Start Over", next: "start" }
        ]
    },

    forestentry: {
        id: "forestentry",
        text: "You vanish into the Olympic forest. It’s dark. Wet. Quiet. Too quiet. NEO hisses.",
        choices: [
            { text: "Follow the sound of water", next: "riverrun" },
            { text: "Climb a tree to look around", next: "treetop" },
            { text: "Start Over", next: "start" }
        ]
    },

    mutation: {
        id: "mutation",
        text: "You awaken in pain. Your eyes burn. Your skin pulses. You're not fully human anymore…",
        choices: [
            { text: "Embrace the change", next: "darkhero" },
            { text: "End your own life", next: "tragicend" },
            { text: "Get back out there", next: "backoutside" },,
            { text: "Start Over", next: "start" }
        ]
    },
    backoutside: {
        id: "backoutside",
        text: "You're mutated but you're ready to head back into the streets and maybe find some help",
        choices: [
            { text: "Look around", next: "streetmadness" },
            { text: "Start Over", next: "start" }
        ]

    },

    balconytrap: {
        id: "balconytrap",
        text: "The door is locked. Something behind it slams into the glass. It cracks. You and NEO are trapped.",
        choices: [
            { text: "Jump down", next: "anklebreak" },
            { text: "Try the roof again", next: "roofsignal" },
            { text: "Start Over", next: "start" }
        ]
    },
    anklebreak: {
        id: "anklebreak",
        text: "You don’t think—you just jump.\n\nThe fall is farther than it looked.\n\nYou land hard. Pain rips through your leg like fire. Something cracks. You scream before your breath is stolen by the impact.\n\nNEO tumbles beside you, hissing and dazed.\n\nYou try to move. Can’t. Your ankle is twisted at an unatural angle.\n\nThe thing behind the balcony door crashes through the glass above, shrieking. It leans over the railing, searching.\n\nYou drag yourself toward the treeline, biting down screams. NEO stays by your side, fur bristling, tail low.\n\nBut you're not fast enough.\n\nYou hear footsteps.\n\nThen teeth.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
      },
      

    infectionpath: {
        id: "infectionpath",
        text: "You stumble into the street, dizzy. Your veins go black. People run from you now.",
        choices: [
            { text: "Beg for help", next: "executed" },
            { text: "Hide in an alley", next: "mutation" },
            { text: "Start Over", next: "start" }
        ]
    },

    toxicchamber: {
        id: "toxicchamber",
        text: "The spores choke you slowly. NEO claws at the walls. You both fade into darkness.",
        choices: [
            { text: "Start Over", next: "start" },
        ]
    },

    survivorcamp: {
        id: "survivorcamp",
        text: "You find a hidden group living underground. They're armed. Suspicious. But one of them smiles at NEO.  A woman in her forties, face smeared with ash, eyes sharp with survival.\n\nHer gaze drops to NEO.\n\nShe kneels slowly, lips parting in the ghost of a smile. \"You brought a cat?\"\n\nThe others hesitate. Lower their weapons. Just slightly.\n\nShe looks at you. \"If that thing trusts you… maybe we should too.\"\n\nYou exhale for the first time in days. But you don't let your guard down. Not yet.",
        choices: [
            { text: "Stay and join them", next: "theend" },
            { text: "Keep moving", next: "forestentry" },
            { text: "Start Over", next: "start" }
        ]
    },

    gearup: {
        id: "gearup",
        text: "You find a crossbow, meds, and cat food. NEO purrs. You’re ready for whatever comes next.",
        choices: [
            { text: "Head for the forest", next: "forestentry" },
            { text: "Search for survivors", next: "survivorcamp" },
            { text: "Start Over", next: "start" }
        ]
    },

    treetop: {
        id: "treetop",
        text: "From the top, you see smoke in the distance. NEO suddenly growls. A humanoid figure is climbing the tree from below.",
        choices: [
            { text: "Kick it down", next: "fatalfall" },
            { text: "Leap to another branch", next: "branchesnap" },
            { text: "Start Over", next: "start" }
        ]
    },

    riverrun: {
        id: "riverrun",
        text: "You follow the river to a collapsed bridge. A child stands alone on the other side… too still.",
        choices: [
            { text: "Call out to them", next: "childtrap" },
            { text: "Turn back quietly", next: "forestentry" },
            { text: "Start Over", next: "start" }
        ]
    },

    cliffedge: {
        id: "cliffedge",
        text: "You and NEO reach a cliff. Below is a chopper landing. You're so close.",
        choices: [
            { text: "Jump", next: "softlanding" },
            { text: "Signal with a flare", next: "rescue" },
            { text: "Start Over", next: "start" }
        ]
    },

    softlanding: {
        id: "softlanding",
        text: "You hit the water hard—cold, fast, unforgiving. The current grabs you before you can even scream. NEO yowls, claws digging into your jacket as you're both dragged downstream.\n\nYou thrash, fight to breathe, but it’s no use. The river is stronger. Darker. Endless.\n\nThen—rocks. You slam into them, barely conscious, and somehow claw your way to shore.\n\nNEO limps out beside you, soaked and shivering but alive.\n\nYou're lost. The landscape’s unfamiliar. No roads. No tracks. Just trees and silence.\n\nYou survive on mushrooms, rainwater, and whatever small game you can catch. Days blur.\n\nThen one morning, with NEO pressed against your side, you spot something—metal glinting beneath moss and dirt.\n\nA door. Steel. Bolted. Sunken into the earth.\n\nA bunker.",
        choices: [
            { text: "Go inside", next: "survivorcamp" },
            { text: "Start Over", next: "start" }
        ]
    },

    rescue: {
        id: "rescue",
        text: "The flare lights the sky. A gunship sees you. A ladder drops. You're lifted into the sky with NEO.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
    }, 
    rescue2: {
        id: "rescue2",
  text: "The radio crackles to life. Static. Then a voice—sharp, urgent. \"Copy that. Coordinates locked. ETA two minutes. Hold position.\"\n\nThe forest vibrates with the low thrum of rotor blades. Trees sway as a black gunship slices through the sky, spotlight sweeping through the mist.\n\nA rope ladder drops from the belly of the beast. The soldier grips your arm. \"You’re not dying in this place. Not today.\"\n\nYou climb. NEO clings to your shoulder, tense but silent. The wind roars around you.\n\nBelow, the forest churns with movement—too many shapes to count. But you're already rising, swallowed by the night.",
  choices: [
    { text: "Start Over", next: "start" }
  ]
    }, 
    stranger: {
        id: "stranger",
        text: "The masked figure lowers their axe and pulls back the hood. Beneath is a weathered face, scarred and tired—but human.\n\n'About damn time I found you,' they mutter, pulling a small radio from their belt. 'HQ’s been tracking your signal since the breach. We lost you in the hills. Thought you were already one of them.'\n\nYou can barely process it. Rescue? After all this time? NEO growls low, but doesn’t move from your side.\n\nThe soldier kneels to NEO’s level. 'You're one hell of a survivor too, furball.'\n\nThe soldier taps the radio. 'Alpha, I’ve got the package. Requesting immediate evac.'\n\nYou’re not sure what “the package” means. You’re not sure you care.\n\nBut you’re going home. Or… somewhere safe. You hope.",
        choices: [
          { text: "Rescued", next: "rescue2" },
          { text: "Start Over", next: "start" }
        ]
      },
      

    darkhero: {
        id: "darkhero",
        text: "You use your new power to hunt the infected. NEO rides your shoulder like a tiny grim reaper. You’ve become legend.",
        choices: [
            { text: "Start Over", next: "start" }

        ]
    },

    quarantine: {
        id: "quarantine",
        text: "YOU'RE TAKEN, caged, and tested. Days pass. You're declared clean. They give you a weapon and send you out to fight.",
        choices: [
            { text: "Escape the base", next: "forestentry" },
            { text: "Join their ranks", next: "darkhero" },
            { text: "Start Over", next: "start" }
        ]
    },

    executed: {
        id: "executed",
        text: "A gunshot. Blackness. NEO screams as they take him away. The end comes fast.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
    },

    childtrap: {
        id: "childtrap",
        text: "The child opens its mouth — a scream like a siren. Dozens of infected pour from the woods. You have seconds.",
        choices: [
            { text: "Fight to the death", next: "tragicend" },
            { text: "Jump into the river", next: "softlanding" },
            { text: "Start Over", next: "start" }
        ]
    },

    branchesnap: {
        id: "branchesnap",
        text: "You fall. The wind is knocked out of you. NEO lands on your chest, shaken but alert. You scramble to your feet, but they're already there—barefoot things with torn faces and blood-caked teeth. They wear remnants of people they used to be, twitching with unnatural jerks. You can hear their breath—wet, snarling. The infection is brutal and unwavering.",
        choices: [
          { text: "Run", next: "forestentry" },
          { text: "Hide under the roots", next: "rootcrawl" },
          { text: "Throw something to distract them", next: "distractionthrow" },
          { text: "Start Over", next: "start" }
        ]
      },
      rootcrawl: {
        id: "rootcrawl",
        text: "You slide beneath the tangled roots of a massive cedar tree. The air is thick with rot and damp earth. NEO squeezes in beside you, tail lashing. The infected sniff the air, footsteps inches from your hiding spot. One drops to its knees, staring right at the roots.",
        choices: [
          { text: "Stay perfectly still", next: "rootend" },
          { text: "Lash out with a branch", next: "rootfight" },
          { text: "Start Over", next: "start" }
        ]
      },
      rootend: {
        id: "rootend",
        text: "You hold your breath. NEO doesn’t move. The creature's face presses into the roots—then it starts gnawing. Soil falls onto your chest as it tears through the wood.\n\nYou never stood a chance. Buried alive by madness and teeth.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
      },
      rootfight: {
        id: "rootfight",
        text: "You jab the branch through the roots. It screeches, stumbling back. You crawl out fast, dragging NEO. But more are coming—your move bought seconds, not safety.\n\nA figure appears—a masked person swinging a fire axe.\n\nYou survive. For now. But you owe a stranger your life… and strangers are rarely kind.",
        choices: [
            {text: "Whos this stranger..", next: "stranger"},
            { text: "Start Over", next: "start" }
        ]
      },   
      distractionthrow: {
        id: "distractionthrow",
        text: "You grab a rock and hurl it deep into the brush. The sound snaps the ferals' heads around. Three of them bolt toward it, screeching.\n\nBut one stays behind, drooling. It starts crawling toward you on all fours.",
        choices: [
          { text: "Sneak past it with NEO", next: "sneakpastinfected" },
          { text: "Kick it and run", next: "kickrunend" },
          { text: "Start Over", next: "start" }
        ]
      },
      sneakpastinfected: {
        id: "sneakpastinfected",
        text: "You move slow, every breath measured. NEO pads beside you, silent. The creature's back is to you—close enough to smell the blood on its skin.\n\nThen a twig snaps.\n\nIt spins and lunges. You scream as it tackles you into the dirt.\n\nNEO runs.\n\nYou won’t get back up.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
      },
      kickrunend: {
        id: "kickrunend",
        text: "You slam your boot into its face. Bone cracks under the force. It lets out a shriek that echoes through the trees.\n\nYou take off, lungs burning, NEO darting ahead of you.\n\nJust as the screeching behind you multiplies, a figure steps into your path—broad-shouldered, masked, holding a bloodstained fire axe. No words. Just a nod.\n\nThe ferals don’t follow.\n\nYou’re not sure if you’ve found help… or traded one danger for another.",
        choices: [
            {text: "Whos this stranger..", next: "stranger"},
            { text: "Start Over", next: "start" }
        ]
      },
      
         
    roofsignal: {
        id: "roofSignal",
        text: "You and NEO climb to the top of the radio tower, your boots slipping on slick metal. You rig the old antenna, power surging through ancient wires as you hit the switch. A crackle... then a signal fires off into the void.\n\nYou wait. NEO paces.\n\nRed lights begin to blink in the distance—drones. Not rescue. Not hope. The government still watches, still hunts. They triangulated your position.\n\nWithin minutes, the horizon glows with flame. A barrage of missiles rains down as NEO lets out a low, guttural growl.\n\nYou grab your cat, holding them close as everything burns. The price of hope... was too high.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
    },

    fatalfall: {
        id: "fatalfall",
        text: "You kick hard. The thing falls but grabs your ankle. You both plummet. NEO wails. Darkness.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
    },

    theend: {
        id: "theend",
        text: "You and NEO have survived… for now. The world is broken, but you're not. You’ve made it another day.",
        choices: [
            { text: "Start Over", next: "start" }
        ]
    }
};
 
const users = []
const companions = []



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



