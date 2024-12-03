// Teachable Machine Model URL
const URL = "https://teachablemachine.withgoogle.com/models/Gmm3UbROo/";

let model, webcam, maxPredictions;
let currentLabel = ""; // Tracks the current label
let labelCounts = {
    "Apple": 0,
    "Orange": 0,
    "Banana": 0,
    "Watermelon": 0,
    "Strawberry": 0,
    "Tender Coconut": 0
};

// Initialize the model and webcam
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Set up the webcam
        const flip = true;
        webcam = new tmImage.Webcam(500, 375, flip); // Updated size
        await webcam.setup();
        webcam.play(); // Start webcam
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        // Start prediction loop
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("Error initializing webcam or model:", error);
    }
}

// Real-time prediction loop
async function loop() {
    try {
        webcam.update(); // Update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("Error during the loop execution:", error);
    }
}

// Run predictions and update labels and counts
async function predict() {
    try {
        const predictions = await model.predict(webcam.canvas);

        // Find the label with the highest probability
        let highestProbability = 0;
        let label = "";

        predictions.forEach(prediction => {
            if (prediction.probability > highestProbability) {
                highestProbability = prediction.probability;
                label = prediction.className;
            }
        });

        console.log("Predicted label:", label); // Debugging log

        // Normalize the label to match the keys in labelCounts
        const normalizedLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

        // Update the current label if it has changed
        if (normalizedLabel !== currentLabel) {
            currentLabel = normalizedLabel;
            document.getElementById("label-display").textContent = currentLabel;

            // Increment count for the label
            if (labelCounts[currentLabel] !== undefined) {
                labelCounts[currentLabel]++;
                console.log(`Updated count for ${currentLabel}:`, labelCounts[currentLabel]); // Debugging log
                document.getElementById(`count-${currentLabel}`).textContent = labelCounts[currentLabel];
            }
        }
    } catch (error) {
        console.error("Error during prediction:", error);
    }
}