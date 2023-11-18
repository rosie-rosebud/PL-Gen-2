// Connect HTML elements to JavaScript
const submitButton = document.getElementById("submit");
const detailsDiv = document.getElementById("detailsDiv");
const recommendationsDiv = document.getElementById("recommendationsDiv");
const timeBox = document.getElementById("timeSelect");
const interestBox = document.getElementById("affordanceSelect");
const ageBox = document.getElementById("ageSelect");

// Check if submit button is found (check this is working because it was buggy!)
if (submitButton) {
  // Attach event listener to make the button work properly
  submitButton.addEventListener("click", submitDetails);
} else {
  console.error("Submit button not found");
}

// Function to display user's choices and recommendations, async so it loads without everything else
async function submitDetails() {
  // Show the details div
  detailsDiv.style.display = "block";
  // Get user input values
  const userTime = timeBox.value;
  const userInterest = interestBox.value;
  const userAge = ageBox.value;
  // Display user's choices
  const choicesMessage = `You have told us you have ${userTime} available, and you want to know more about how to implement ${userInterest} in your ${userAge} classroom. Let's take a look at your learning journey for today!`;
  document.getElementById("choices").textContent = choicesMessage;

  // This whole part links this to the JSON file
  try {
    // Load recommendations from the JSON
    const recommendations = await loadRecommendations();
    // Generate a random recommendation based on what the user selected
    const randomRecommendationObject = generateRandomRecommendation(recommendations, userTime, userInterest, userAge);

    // Display the random recommendation
    recommendationsDiv.style.display = "block";
    // Clear any previous content
    recommendationsDiv.innerHTML = '';

    if (randomRecommendationObject) {
      const randomRecommendationUrl = randomRecommendationObject.url;
      // Embed the YouTube video into the recommendationsDiv
      recommendationsDiv.innerHTML = `<iframe width="560" height="315" src="${randomRecommendationUrl}" frameborder="0" allowfullscreen></iframe>`;
      const randomRecommendation = randomRecommendationObject.text;
      const recommendationsMessage = document.createElement("p");
      recommendationsMessage.textContent = randomRecommendation;
      recommendationsDiv.appendChild(recommendationsMessage);
    }
  } catch (error) {
    console.error("Error loading or processing recommendations:", error);
  }
}

// Function to generate a random recommendation based on loaded recommendations
function generateRandomRecommendation(recommendations, userTime, userInterest, userAge) {
  // Get recommendations for the user's selected time and interest
  const userRecommendations = recommendations[userTime] && recommendations[userTime][userInterest] && recommendations[userTime][userInterest][userAge];

  if (!userRecommendations || userRecommendations.length === 0) {
    return null; 
  }

  // Randomly select a recommendation from the list
  const randomIndex = Math.floor(Math.random() * userRecommendations.length);
  return userRecommendations[randomIndex];
}

// Function to load recommendations from the JSON file following the Node.js server setup
async function loadRecommendations() {
  try {
    const response = await fetch("http://localhost:3000/recommendations.json");
    if (!response.ok) {
      throw new Error("Failed to load recommendations data.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading recommendations:", error);
    throw error;
  }
}
