/*global chrome*/

chrome.runtime.onMessage.addListener(function (msg, sender, sendres) {
    if (msg === "toggle") {
        toggle();
        console.log("msg received")
    }
});

domIsReady().then(() => {
    document.body.appendChild(dialog);
})

document.addEventListener('click', (event) => {
    // Check if the clicked element is the AI button
    if (event.target.id === "aiButton") {
        toggle();
    } else {
        // Close the dialog if anything else is clicked
        handle();
    }
});

var dialog = document.createElement('iframe');
dialog.id = "tron-assistant-dialog";
dialog.style.background = "white";
dialog.style.height = "60vh";
dialog.style.width = "0px";
dialog.style.position = "fixed";
dialog.style.top = "50%";
dialog.style.left = "50%";
dialog.style.border = "none";
dialog.style.zIndex = "9000000000000000000";
dialog.style.transform = "translate(-50%, -50%)";
dialog.style.borderRadius = "10px";
dialog.src = chrome.runtime.getURL("index.html");

function handle() {
    if (dialog.style.width == "50vw") {
        dialog.style.width = "0px";
        dialog.style.border = "none";
    }
}

function toggle() {
    if (dialog.style.width == "0px") {
        dialog.style.width = "50vw";
        dialog.border = "1px solid #ccc";
    } else {
        dialog.style.width = "0px";
        dialog.style.border = "none";
    }
}

/**
 * Returns a promise that resolves when the DOM is loaded (does not wait for images to load)
 */
function domIsReady() {
    // already loaded
    if (['interactive', 'complete'].includes(document.readyState)) {
        return Promise.resolve();
    }

    // wait for load
    return new Promise((resolve) => window.addEventListener('DOMContentLoaded', resolve, { once: true }));
}


window.onload = function () {
    if(window.location.href.startsWith("https://developers.tron.network/")) {
        // Create the "Ask AI" button container
        const aiButtonContainer = document.createElement('div');
        aiButtonContainer.id = 'aiButton';
        aiButtonContainer.style.position = 'fixed';
        aiButtonContainer.style.cursor = 'pointer';
        aiButtonContainer.style.bottom = '20px';
        aiButtonContainer.style.right = '20px';
        aiButtonContainer.style.zIndex = '9999'; // High z-index to ensure visibility
        aiButtonContainer.style.width = '72px'; // Set the width to make it square
        aiButtonContainer.style.height = '72px'; // Set the height to make it square
        aiButtonContainer.style.backgroundColor = 'lightcoral'; // Light red background
        aiButtonContainer.style.borderRadius = '10%'; // Makes it circular
        aiButtonContainer.style.padding = '8px'; // Makes it circular
        aiButtonContainer.style.display = 'flex'; // Makes it circular
        aiButtonContainer.style.flexDirection = 'column'; // Makes it circular
        aiButtonContainer.style.justifyContent = 'center'; // Makes it circular
        aiButtonContainer.style.alignItems = 'center'; // Makes it circular


        // Create the "Ask AI" button text
        const aiButtonText = document.createElement('div');
        aiButtonText.textContent = 'Ask AI';
        aiButtonText.style.color = 'white'; // White text color
        aiButtonText.style.fontWeight = 'bold'; // Bold text
        aiButtonText.style.textAlign = 'center'; // Center text
        aiButtonText.style.textAlign = 'center'; // Center text

        // Create the "Ask AI" button logo
        const aiLogo = document.createElement('img');
        aiLogo.src = 'https://i.ibb.co/2yMH98M/logo.png'; // Replace with the path to your logo
        aiLogo.style.display = 'block'; // Ensure the logo is on a new line
        aiLogo.style.margin = 'auto'; // Add a gap of 8px between text and image
        aiLogo.style.height = '48px'; // Add a gap of 8px between text and image
        aiLogo.style.width = '48px'; // Add a gap of 8px between text and image

        // Append the text and logo to the container
        aiButtonContainer.appendChild(aiLogo);
        aiButtonContainer.appendChild(aiButtonText);

        // Append the container to the document body
        document.body.appendChild(aiButtonContainer);
    }
}

