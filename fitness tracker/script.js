// Initialize food database and food items
let foodDatabase = [
    { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, sugar: 0 },
    
    // Add more predefined food items as needed
];

let foodItems = []; // Array to store added food items
let metrics = []; // Array to store body metrics
let weightData = []; // For storing weight data for the chart
let bodyFatData = []; // For storing body fat data for the chart
let chart;

// Function to initialize chart
function initChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Dates will be added here
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: weightData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                },
                {
                    label: 'Body Fat (%)',
                    data: bodyFatData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

// Call the initChart function to initialize the chart
initChart();

// Function to update the chart with new metrics
function updateChart() {
    const lastDate = metrics[metrics.length - 1].date; // Get last date
    const dateString = new Date(lastDate).toLocaleDateString(); // Format the date

    // Add new data to the chart
    chart.data.labels.push(dateString); // Push date to labels
    chart.data.datasets[0].data.push(metrics[metrics.length - 1].weight); // Push weight data
    chart.data.datasets[1].data.push(metrics[metrics.length - 1].bodyFat); // Push body fat data
    chart.update(); // Update the chart
}

// Body metrics form submission
document.getElementById('metricsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const date = document.getElementById('date').value; // Get date
    const weight = parseFloat(document.getElementById('weight').value); // Parse weight as a float
    const bodyFat = parseFloat(document.getElementById('bodyFat').value); // Parse body fat as a float

    // Push metrics to the array
    metrics.push({ date, weight, bodyFat });

    // Reset the form
    document.getElementById('metricsForm').reset();
    
    // Update the chart with new data
    updateChart();
});

// Populate the datalist with food items
const foodSuggestions = document.getElementById('foodSuggestions');

// Function to populate the datalist with food items
function populateFoodSuggestions() {
    foodSuggestions.innerHTML = ''; // Clear existing suggestions

    foodDatabase.forEach(food => {
        const option = document.createElement('option');
        option.value = food.name; // The name to show in the input
        foodSuggestions.appendChild(option); // Add to datalist
    });
}

// Call this function to initialize food suggestions on page load
populateFoodSuggestions();

// Autofill for food search
const foodSearch = document.getElementById('foodSearch');

foodSearch.addEventListener('input', function() {
    const inputValue = foodSearch.value.toLowerCase();

    // Filter the foods based on the input value
    const filteredFoods = foodDatabase.filter(food => food.name.toLowerCase().includes(inputValue));

    // Clear the current suggestions
    foodSuggestions.innerHTML = '';

    filteredFoods.forEach(food => {
        const option = document.createElement('option');
        option.value = food.name; // Show the name of the food in the suggestions
        foodSuggestions.appendChild(option); // Add to datalist
    });
});

// Function to update nutritional values based on selected food
function updateNutritionalValues(selectedFoodName) {
    const selectedFood = foodDatabase.find(food => food.name === selectedFoodName);
    if (selectedFood) {
        // Set nutritional values based on selection
        document.getElementById('calories').value = selectedFood.calories;
        document.getElementById('protein').value = selectedFood.protein;
        document.getElementById('carbs').value = selectedFood.carbs;
        document.getElementById('sugar').value = selectedFood.sugar;
    } else {
        // Clear fields if the food is not found
        document.getElementById('calories').value = '';
        document.getElementById('protein').value = '';
        document.getElementById('carbs').value = '';
        document.getElementById('sugar').value = '';
    }
}

// Handle food selection to update nutritional values when an option is selected
foodSearch.addEventListener('change', function() {
    updateNutritionalValues(foodSearch.value);
});

// Handle form submission for adding food
document.getElementById('foodForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const foodName = foodSearch.value; // Get food name
    const calories = document.getElementById('calories').value; // Get calories
    const protein = document.getElementById('protein').value; // Get protein
    const carbs = document.getElementById('carbs').value; // Get carbs
    const sugar = document.getElementById('sugar').value; // Get sugar

    // Check if the food is already in the database
    const existingFood = foodDatabase.find(food => food.name === foodName);

    if (existingFood) {
        foodItems.push({ foodName, calories, protein, carbs, sugar });
    } else {
        // Prompt user to enter missing data if the food is not found
        const newFoodData = {
            name: foodName,
            calories: parseInt(calories), // Parse as integer
            protein: parseFloat(protein), // Parse as float
            carbs: parseFloat(carbs), // Parse as float
            sugar: parseFloat(sugar) // Parse as float
        };

        // Add the new food to the database
        foodDatabase.push(newFoodData);
        foodItems.push(newFoodData); // Store in foodItems array
        populateFoodSuggestions(); // Refresh food suggestions
    }

    // Reset the form
    document.getElementById('foodForm').reset();
});
