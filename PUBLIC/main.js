const storyContainer = document.getElementById('story-container');
const deleteForm = document.getElementById('deleteChoicesForm');
const deleteChoicesContainer = document.getElementById('deleteChoicesForm'); // This is the container to show/hide
const userNameInput = document.querySelector('#userProfileForm #userName');

let currentUserName = '';

//Change cat name to users choice
function personalizeText(text, catName) {
    return text.replace(/\bNEO\b/g, catName);
  }
  

// This default function is called to start if no stepID is provided
async function loadStep(stepId = 'start') {
  try {
    const res = await fetch(`/api/steps/${stepId}`); // Send a GET request to fetch the step data from the server
    if (!res.ok) throw new Error('Step not found'); //Throw error if response fails
    const step = await res.json(); //Parse the Json Data from the response
// Render the step using renderStep function Render means to display text and content onto the page
    renderStep(step);
  } catch (err) {
    //Dispay error msg if error happens
    storyContainer.innerHTML = `<p>Oops! ${err.message}</p>`;
  }
}
//Take a step object and render it into the HTML
function renderStep(step) {
    const catName = localStorage.getItem('catName') || 'NEO'; // find Neo cat name to replace
    const personalizedText = personalizeText(step.text, catName); // replace NEO with cat's name
    //HTML string with the step's text and choices 
    const html = `
    <p>${personalizedText}</p>
    <div class="choices">
      ${step.choices
        .map((choice) => {
          const personalizedChoiceText = personalizeText(choice.text, catName); // Replace in choice text too
          return `<button onclick="handleUserChoice('${step.id}', '${choice.text}', '${choice.next}')">${personalizedChoiceText}</button>`;
        })
        .join('')}
    </div>
  `;
//Set the story container's content to the generated HTML
  storyContainer.innerHTML = html;
}


//Handler for saving and loading
function handleUserChoice(stepId, choiceText, nextStepId) {
    handleChoice(currentUserName, stepId, choiceText);
    loadStep(nextStepId);
  }
  
  
//function send the users choice to the server to be saved
function handleChoice(userName, stepId, chosenOption) {
    // Send a POST request to the choices file
    fetch('/choices', {
      method: 'POST', // HTTP method for creating data
      headers: { 'Content-Type': 'application/json' }, // Tell the server im sending JSON
      body: JSON.stringify({
        userName: userName, 
        step: stepId, // The step in the story where the choice was made
        choice: chosenOption 
       
   // The choice the user picked
      })
    })
    .then(res => res.json()) // Parse the server response as JSON
    .then(data => {
      console.log('Choice recorded:', data);
    })
    .catch(err => {
      console.error('Error recording choice:', err);
    });
  }
  
//Profile and delete
// Check if the user has a profile and choices
async function checkUserProfileAndChoices(userName) {
    try {
      const res = await fetch(`/api/choices/${userName}`); // Endpoint to check choices for the user
      const data = await res.json();
  
      if (data.choices && data.choices.length > 0) {
        deleteChoicesContainer.style.display = 'block'; // Show the delete form if there are choices
      } else {
        deleteChoicesContainer.style.display = 'none'; // Hide the delete form if no choices
      }
    } catch (err) {
      console.error('Error fetching user choices:', err);
      deleteChoicesContainer.style.display = 'none'; // Hide if there’s an error fetching data
    }
  }
  
  // Profile creation
  async function createUserProfile() {
    const userName = userNameInput.value || 'Guest'; // Default to 'Guest' if no input
    await fetch('/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName })
    });
  
    checkUserProfileAndChoices(userName); // Check if this user has choices
  }
// Profile creation (now includes catName)
userProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = document.querySelector('#userProfileForm #userName').value;
    const catName = document.querySelector('#userProfileForm #catName').value;
    localStorage.setItem('catName', catName); // Save cat name to localStorage

    try {
      const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, petName: catName })
      });
  
      const data = await res.json();
      console.log('User profile created:', data);
  
      // Hide intro form and show intro text
      document.getElementById('intro-container').style.display = 'none';
      document.getElementById('intro-text').style.display = 'block';
  
      currentUserName = userName; // Update the global username
      checkUserProfileAndChoices(userName); // Delete button shows if user has choices recorded
      loadStep(); // Start the story
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  });
  
  // Add an event listener to form when it's submitted
  deleteForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
  });
    // Get users name from  input field
    const userName = userNameInput.value;

// Add an event listener to form when it's submitted
deleteForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Get users name from  input field
    const userName = userNameInput.value;

    

    // Send a DELETE request to the server
    fetch(`/choices/${userName}`, {  // The URL includes the user name
        method: 'DELETE', // type of request being sent
        headers: {
            'Content-Type': 'application/json', // Tells the server its sending JSON
        },
    })
    .then(function(response) {
        if (response.ok) {
            alert(`Choices for ${userName} have been deleted`);
            window.location.reload(); // This reloads the page to reflect the changes
        } else {
            response.json().then(function(data) {
                alert(data.error || 'An error occurred');
            });
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('An error occurred while deleting choices');
    });
});


// const buttons = storyContainer.querySelectorAll('.choices button');
// buttons.forEach((button) => {
//   button.addEventListener('click', () => {
//     const nextStepId = button.getAttribute('data-next');
//     loadStep(nextStepId); // Call loadStep when the button is clicked
//   });


// Load the first step
//loadStep(); //Commented out becuas ei dont want it to load immedietly 
