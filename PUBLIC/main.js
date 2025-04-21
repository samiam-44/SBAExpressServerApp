const storyContainer = document.getElementById('story-container');

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
    //HTML string with the step's text and choices 
  const html = `
    <p>${step.text}</p>
    <div class="choices">
      ${step.choices
        .map(  // Map each choice into a button that loads the nect step when clicked
          (choice) =>
            `<button onclick="handleUserChoice('${step.id}', '${choice.value}', '${choice.next}')">${choice.text}</button>` //basically like an event listener
        )
        .join('')}
    </div>
  `;
//Set the story container's content to the generated HTML
  storyContainer.innerHTML = html;
}
//Handler for saving and loading
function handleUserChoice(stepId, choiceText, nextStepId) {
    const userName = prompt("Enter your name:") || "Guest"; // replace later with better login system
    handleChoice(userName, stepId, choiceText); // Save to server
    loadStep(nextStepId); // Move to next step
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
        choice: chosenOption    // The choice the user picked
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

const deleteForm = document.getElementById('deleteChoicesForm');
const userNameInput = document.getElementById('userName');

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
loadStep();
