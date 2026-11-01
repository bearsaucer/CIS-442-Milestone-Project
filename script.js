/* One JavaScript file shared by all the pages. */
const isLoginPage = Boolean(document.getElementById("login-form"));
if (!isLoginPage) {
    const signedInEmail = sessionStorage.getItem("kodakBusinessSignedInEmail");
    if (!signedInEmail) {
        // replace() sends the visitor to login.html.
        window.location.replace("login.html");
    }
}

/* LOGIN PAGE */

if (document.getElementById("login-form") && document.getElementById("signup-form")) {
/* Handles the login and sign-up screens and their forms. */
/* Find the area where the user chooses to log in or sign up. */
const accountOptions = document.getElementById("account-options");
/* Find the section that contains the login form. */
const loginSection = document.getElementById("login-section");
/* Find the section that contains the sign-up form. */
const signupSection = document.getElementById("signup-section");
/* Find the login form so JavaScript can work with it. */
const loginForm = document.getElementById("login-form");
/* Find the sign-up form so JavaScript can work with it. */
const signupForm = document.getElementById("signup-form");
/* Find the area where login messages will appear. */
const loginMessage = document.getElementById("login-message");
/* Find the area where sign-up messages will appear. */
const signupMessage = document.getElementById("signup-message");



/* Show the login form, hide the other sections, and clear any old message. */
function showLoginForm() {
    accountOptions.hidden = true;
    loginSection.hidden = false;
    signupSection.hidden = true;
    loginMessage.textContent = "";
}

/* Show the sign-up form and clear any old sign-up message. */
function showSignupForm() {
    accountOptions.hidden = true;
    loginSection.hidden = true;
    signupSection.hidden = false;
    signupMessage.textContent = "";
}

/* Go back to the screen where the visitor chooses Log In or Sign Up. */
function returnToAccountChoices() {
    accountOptions.hidden = false;
    loginSection.hidden = true;
    signupSection.hidden = true;
    loginMessage.textContent = "";
    signupMessage.textContent = "";
}

/* Check the sign-up details, save a demo account, and open the homepage. */
function handleSignupSubmit(event) {
    event.preventDefault();

    const companyName = document.getElementById("company-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        signupMessage.textContent = "The passwords do not match. Please try again.";
        return;
    }

    const storageKey = "kodakBusinessAccount-" + email;
    const existingAccount = localStorage.getItem(storageKey);

    if (existingAccount !== null) {
        signupMessage.textContent =
            "An account already exists for this email. Please log in instead.";
        return;
    }

    const account = {
        companyName: companyName,
        email: email,
        password: password
    };

    localStorage.setItem(storageKey, JSON.stringify(account));
    sessionStorage.setItem("kodakBusinessSignedInEmail", email);
    window.location.href = "index.html";
}

/* Check the email and password against the demo account saved in the browser. */
function handleLoginSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const storageKey = "kodakBusinessAccount-" + email;

    const savedAccountText = localStorage.getItem(storageKey);
    if (savedAccountText === null) {
        loginMessage.textContent =
            "No account was found for that email. Please sign up first.";
        return;
    }

    let savedAccount;
    try {
        // If the saved account data cannot be read, show a message instead of stopping the page.
        savedAccount = JSON.parse(savedAccountText);
    } catch (error) {
        loginMessage.textContent =
            "The saved demo account could not be read. Please sign up again.";
        return;
    }

    if (savedAccount.password !== password) {
        loginMessage.textContent = "The password is incorrect. Please try again.";
        return;
    }

    sessionStorage.setItem("kodakBusinessSignedInEmail", email);
    window.location.href = "index.html";
}

/* Run the right function when a visitor clicks a button or submits a form. */
document.getElementById("show-login").addEventListener("click", showLoginForm);
document.getElementById("show-signup").addEventListener("click", showSignupForm);
document.getElementById("login-to-signup").addEventListener("click", showSignupForm);
document.getElementById("signup-to-login").addEventListener("click", showLoginForm);
signupForm.addEventListener("submit", handleSignupSubmit);
loginForm.addEventListener("submit", handleLoginSubmit);

}

/* ORDER PAGE  */

if (document.getElementById("current-orders-button") && document.getElementById("past-orders-button")) {
/* 
 * Current orders use id, product, orderDate, and trackingNumber.
 * Past orders use id, product, orderDate, and deliveryAddress.
 */
const currentOrders = [];
const pastOrders = [];

// Find the button used to display current orders.
const currentButton = document.getElementById("current-orders-button");
// Find the button used to display past orders.
const pastButton = document.getElementById("past-orders-button");
// Find the section where current orders are displayed.
const currentPanel = document.getElementById("current-orders-panel");
// Find the section where past orders are displayed.
const pastPanel = document.getElementById("past-orders-panel");

/* Show either Current Orders or Past Orders and update the selected tab. */
function showOrders(type) {
    const showCurrent = type === "current";

    currentPanel.hidden = !showCurrent;
    pastPanel.hidden = showCurrent;

    currentButton.classList.toggle("selected", showCurrent);
    pastButton.classList.toggle("selected", !showCurrent);
    currentButton.setAttribute("aria-pressed", String(showCurrent));
    pastButton.setAttribute("aria-pressed", String(!showCurrent));

    if (showCurrent) {
        displayOrders(currentOrders, "current-orders-table",
            "no-current-orders", "current-orders-container", "current");
    } else {
        displayOrders(pastOrders, "past-orders-table",
            "no-past-orders", "past-orders-container", "past");
    }
}

/* Fill the right table with orders, or show "No orders found" if the list is empty.
 * Current orders show tracking numbers; past orders show delivery addresses.
 */
function displayOrders(orders, tableId, messageId, containerId, type) {
    const tableBody = document.getElementById(tableId);
    const emptyMessage = document.getElementById(messageId);
    const tableContainer = document.getElementById(containerId);
    
    // remove all the existing rows or content from the table body 
    tableBody.replaceChildren();

    if (orders.length === 0) {
        emptyMessage.hidden = false;
        tableContainer.hidden = true;
        return;
    }

// Hide the message that says no orders were found.
emptyMessage.hidden = true;

// Show the section that contains the orders table.
tableContainer.hidden = false;

// Go through each order in the orders list.
orders.forEach(function (order) {

    // Create a new table row for the order.
    const row = document.createElement("tr");

    // Add the order ID to the row.
    addCell(row, order.id);

    // Add the product name to the row.
    addCell(row, order.product);

    // Add the order date to the row.
    addCell(row, order.orderDate);

    // If this is the current orders page, show the tracking number.
    if (type === "current") {
        addCell(row, order.trackingNumber);

    // Otherwise, show the delivery address for past orders.
    } else {
        addCell(row, order.deliveryAddress);
    }

    // Add the completed row to the orders table.
    tableBody.appendChild(row);
});
}

/* Add one cell to a table row. If there is no value, show "Not available." */
function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value || "Not available";
    row.appendChild(cell);
}

/* Switch tabs when clicked, and show Current Orders when the page first opens. */
currentButton.addEventListener("click", function handleCurrentOrdersClick() {
    showOrders("current");
});

pastButton.addEventListener("click", function handlePastOrdersClick() {
    showOrders("past");
});

showOrders("current");

}

/* PRODUCTS PAGE */

// Check whether the page contains product cards.
if (document.querySelector(".product-card") || document.querySelector("[data-product]")) {
// Create a function to read the selected product from the URL.
function readSelectedProduct() {
// Get the extra information from the URL.
const urlParameters = new URLSearchParams(window.location.search);
// Get the selected product's name.
return urlParameters.get("product");
}
// Save the selected product's name.
const selectedProduct = readSelectedProduct();
// Check if a product was selected.
if (selectedProduct) {
// Print the product name in the console for testing.
console.log("Selected product:", selectedProduct);
}

}

/* SUPPORT PAGE  */

if (document.getElementById("support-form")) {
/* Update the character counter and show a demo message when the form is submitted.
 */

/* Get the form and the elements that its functions need to update. */
const supportForm = document.getElementById("support-form");
const supportMessage = document.getElementById("support-message");
const issueDescription = document.getElementById("issue-description");
const characterCount = document.getElementById("character-count");

/* Update the character count and turn it red when the visitor gets close to the limit. */
function updateCharacterCount() {
    const currentLength = issueDescription.value.length;
    characterCount.textContent = currentLength + " / 2000 characters";
    characterCount.style.color = currentLength >= 1800 ? "#c82026" : "#666666";
}

/* Show a confirmation for this demo form and clear the fields after submission. */
function handleSupportSubmit(event) {
    event.preventDefault();

    // Clear the form first, then show the new confirmation message.
    supportForm.reset();
    updateCharacterCount();

    supportMessage.textContent =
        "Your support request has been completed for this demonstration. " +
        "Please keep reference number 123456789 for your records.";
    supportMessage.style.color = "#16803c";
}

/* Clear the confirmation and reset the character counter when the form is cleared. */
function handleSupportReset() {
    supportMessage.textContent = "";
    updateCharacterCount();
}

// Update the counter when typing, and handle form submit/reset actions.
issueDescription.addEventListener("input", updateCharacterCount);
supportForm.addEventListener("submit", handleSupportSubmit);
supportForm.addEventListener("reset", handleSupportReset);

// Show the correct character count when the page opens.
updateCharacterCount();

}