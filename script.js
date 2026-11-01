/*
 * KODAK BUSINESS HUB — SINGLE JAVASCRIPT FILE
 *
 * This file replaces auth.js, index.js, login.js, order.js, products.js, and
 * support.js. Every HTML page loads this same script.js file. The checks below
 * identify which page is open and initialize only the features belonging to it.
 * This prevents functions or element references from one page interfering with
 * another page.
 *
 * SECURITY NOTE: This is a classroom/demo front end. Browser storage is not a
 * secure authentication system, and the demo stores passwords as plain text.
 * A real site needs server-side authentication and securely hashed passwords.
 */

/* ======================== SHARED PAGE ACCESS CHECK ======================== */
// A login page does not require an existing session. Other pages in this site
// require the demo sign-in key. defer ensures the HTML has been parsed first.
const isLoginPage = Boolean(document.getElementById("login-form"));
if (!isLoginPage) {
    const signedInEmail = sessionStorage.getItem("kodakBusinessSignedInEmail");
    if (!signedInEmail) {
        // replace() redirects to login.html without leaving this page as a simple Back target.
        window.location.replace("login.html");
    }
}

/* ============================== LOGIN PAGE ================================ */
if (document.getElementById("login-form") && document.getElementById("signup-form")) {
/*
 * LOGIN AND SIGN-UP PAGE JAVASCRIPT
 *
 * This file controls switching between the account-choice screen, login form,
 * and sign-up form. It also simulates account creation and login using browser
 * storage for a class project.
 *
 * SECURITY WARNING:
 * This is only a front-end demonstration. Passwords are saved as plain text in
 * localStorage, which is not safe for real accounts. Never use a real password
 * here. A production site must send credentials to a secure server, hash
 * passwords on the server, and use a properly managed authenticated session.
 */

/* Cache references to the HTML elements used more than once.
 * getElementById() searches the page for the element with the matching unique id.
 * Saving each reference in a const avoids repeatedly searching the page.
 */
const accountOptions = document.getElementById("account-options");
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginMessage = document.getElementById("login-message");
const signupMessage = document.getElementById("signup-message");

/*
 * showLoginForm()
 * PURPOSE: Display the login form and hide the account-choice and sign-up sections.
 * HOW IT WORKS: The hidden property controls whether an element is displayed.
 * It also clears the previous login message so an old error is not shown again.
 */
function showLoginForm() {
    accountOptions.hidden = true;
    loginSection.hidden = false;
    signupSection.hidden = true;
    loginMessage.textContent = "";
}

/*
 * showSignupForm()
 * PURPOSE: Display the sign-up form and hide the other account sections.
 * HOW IT WORKS: It toggles the hidden properties and clears the sign-up message,
 * allowing the visitor to start with a clean form.
 */
function showSignupForm() {
    accountOptions.hidden = true;
    loginSection.hidden = true;
    signupSection.hidden = false;
    signupMessage.textContent = "";
}

/*
 * returnToAccountChoices()
 * PURPOSE: Return the visitor to the first screen with the Log In and Sign Up options.
 * HOW IT WORKS: All forms are hidden and the account-choice section is made visible.
 * This helper is available for future use if a Back/Cancel button is added.
 */
function returnToAccountChoices() {
    accountOptions.hidden = false;
    loginSection.hidden = true;
    signupSection.hidden = true;
    loginMessage.textContent = "";
    signupMessage.textContent = "";
}

/*
 * handleSignupSubmit(event)
 * PURPOSE: Validate the sign-up fields, create a demo account, and open the homepage.
 * PARAMETER: event is the browser's submit event for the sign-up form.
 * HOW IT WORKS:
 * 1. preventDefault() stops the browser from refreshing the page automatically.
 * 2. Field values are read; trim() removes accidental surrounding spaces from
 *    company/email text and toLowerCase() makes email lookup case-insensitive.
 * 3. The two password fields are compared and duplicate email accounts are rejected.
 * 4. JSON.stringify() converts the account object to a string because localStorage
 *    can store strings. The demo signed-in email is then placed in sessionStorage.
 * 5. The visitor is redirected to index.html after successful sign-up.
 */
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

/*
 * handleLoginSubmit(event)
 * PURPOSE: Check the entered email and password against a previously created demo account.
 * PARAMETER: event is the browser's submit event for the login form.
 * HOW IT WORKS:
 * 1. preventDefault() keeps the browser from reloading the page.
 * 2. The email is normalized to lowercase and used to build the account storage key.
 * 3. getItem() retrieves the saved account string. If no account exists, an error
 *    is displayed and return stops the function.
 * 4. JSON.parse() converts the saved JSON text back into an object.
 * 5. The entered password is compared with the saved demo password. If it matches,
 *    sessionStorage records the signed-in email and the browser opens index.html.
 */
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
        // JSON.parse() can throw an error if browser storage contains invalid JSON.
        // Catching that error prevents a corrupted demo entry from breaking the page.
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

/* Connect buttons and forms to the named functions above.
 * addEventListener() waits for the specified user action, then calls the function.
 */
document.getElementById("show-login").addEventListener("click", showLoginForm);
document.getElementById("show-signup").addEventListener("click", showSignupForm);
document.getElementById("login-to-signup").addEventListener("click", showSignupForm);
document.getElementById("signup-to-login").addEventListener("click", showLoginForm);
signupForm.addEventListener("submit", handleSignupSubmit);
loginForm.addEventListener("submit", handleLoginSubmit);

}

/* ============================== ORDER PAGE ================================ */
if (document.getElementById("current-orders-button") && document.getElementById("past-orders-button")) {
/*
 * ORDER PAGE JAVASCRIPT
 *
 * The order page uses sample arrays to demonstrate how current and past orders
 * would appear. Both arrays are empty by default, so visitors see "No orders found."
 * Add sample objects to the relevant array when you want to demonstrate populated
 * tables. This page does not connect to a real order database or shipping service.
 */

/* SAMPLE DATA SHAPE
 * Current order:
 * { id: "ORD-1001", product: "Printing Ink", orderDate: "Oct 20, 2026",
 *   trackingNumber: "TRK-123456" }
 *
 * Past order:
 * { id: "ORD-0990", product: "Print Supplies", orderDate: "Sep 10, 2026",
 *   deliveryAddress: "123 Main Street, Brockport, NY" }
 */
const currentOrders = [];
const pastOrders = [];

// Cache frequently used elements so functions can update them without searching again.
const currentButton = document.getElementById("current-orders-button");
const pastButton = document.getElementById("past-orders-button");
const currentPanel = document.getElementById("current-orders-panel");
const pastPanel = document.getElementById("past-orders-panel");

/*
 * showOrders(type)
 * PURPOSE: Switch between the Current Orders and Past Orders panels.
 * PARAMETER: type should be "current" or "past".
 * HOW IT WORKS:
 * - It calculates which panel should be visible and sets each panel's hidden property.
 * - classList.toggle() adds/removes the selected styling based on the Boolean value.
 * - aria-pressed communicates the selected state to assistive technology.
 * - Finally, it calls displayOrders() with the matching data and table element IDs.
 */
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

/*
 * displayOrders(orders, tableId, messageId, containerId, type)
 * PURPOSE: Render the orders in the correct table or show an empty-state message.
 * PARAMETERS:
 * - orders: array of order objects to display.
 * - tableId: id of the table's <tbody>.
 * - messageId: id of the "No orders found" message.
 * - containerId: id of the wrapper around the table.
 * - type: "current" adds tracking numbers; "past" adds delivery addresses.
 * HOW IT WORKS:
 * - replaceChildren() clears any rows from the previous render.
 * - If the array is empty, the function shows the empty message and stops with return.
 * - Otherwise, it reveals the table and loops through each order with forEach().
 * - For each order it creates a <tr>, adds the shared columns, adds the appropriate
 *   final column, and appends the finished row to the table body.
 */
function displayOrders(orders, tableId, messageId, containerId, type) {
    const tableBody = document.getElementById(tableId);
    const emptyMessage = document.getElementById(messageId);
    const tableContainer = document.getElementById(containerId);

    tableBody.replaceChildren();

    if (orders.length === 0) {
        emptyMessage.hidden = false;
        tableContainer.hidden = true;
        return;
    }

    emptyMessage.hidden = true;
    tableContainer.hidden = false;

    orders.forEach(function (order) {
        const row = document.createElement("tr");

        addCell(row, order.id);
        addCell(row, order.product);
        addCell(row, order.orderDate);

        if (type === "current") {
            addCell(row, order.trackingNumber);
        } else {
            addCell(row, order.deliveryAddress);
        }

        tableBody.appendChild(row);
    });
}

/*
 * addCell(row, value)
 * PURPOSE: Add one table cell (<td>) to a row.
 * PARAMETERS: row is the table row to update; value is the text to display.
 * HOW IT WORKS: createElement() creates a new <td>. textContent inserts the value
 * as plain text rather than interpreting it as HTML, which is safer. If the value
 * is missing or empty, the cell displays "Not available". appendChild() adds it.
 */
function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value || "Not available";
    row.appendChild(cell);
}

/* These event handlers call showOrders() when a visitor chooses a tab.
 * The last call selects Current Orders as the default panel on initial page load.
 */
currentButton.addEventListener("click", function handleCurrentOrdersClick() {
    showOrders("current");
});

pastButton.addEventListener("click", function handlePastOrdersClick() {
    showOrders("past");
});

showOrders("current");

}

/* ============================= PRODUCTS PAGE ============================== */
if (document.querySelector(".product-card") || document.querySelector("[data-product]")) {
/*
 * PRODUCTS PAGE JAVASCRIPT
 *
 * Authentication is checked separately by auth.js. This page currently uses
 * normal HTML links for product details and quote requests, so it needs no click
 * handlers. The small query-string helper below reads an optional product value
 * from URLs such as products.html?product=prosper-6000.
 */

/*
 * readSelectedProduct()
 * PURPOSE: Read the optional "product" value from the current page URL.
 * RETURNS: The product identifier as a string, or null if no product parameter exists.
 * HOW IT WORKS:
 * - window.location.search contains the URL portion after the question mark.
 * - URLSearchParams parses that text into named parameters.
 * - get("product") returns the value for the product key, if present.
 * This value is currently logged for demonstration/debugging only; it does not
 * change the visible product cards.
 */
function readSelectedProduct() {
    const urlParameters = new URLSearchParams(window.location.search);
    return urlParameters.get("product");
}

const selectedProduct = readSelectedProduct();

if (selectedProduct) {
    // console.log() writes a diagnostic message to the browser developer console.
    console.log("Selected product:", selectedProduct);
}

}

/* ============================== SUPPORT PAGE =============================== */
if (document.getElementById("support-form")) {
/*
 * SUPPORT PAGE JAVASCRIPT
 *
 * This script updates the issue-description character counter and handles the
 * support form's demonstration submission. No request is sent to a real support
 * team or database; the confirmation is only shown in the browser.
 */

/* Cache the form, confirmation message, description field, and counter elements.
 * These references are reused by the event handlers below.
 */
const supportForm = document.getElementById("support-form");
const supportMessage = document.getElementById("support-message");
const issueDescription = document.getElementById("issue-description");
const characterCount = document.getElementById("character-count");

/*
 * updateCharacterCount()
 * PURPOSE: Show how many characters have been typed into the issue description.
 * HOW IT WORKS: value.length counts the characters currently in the textarea.
 * textContent updates the counter text. At 1,800 characters, the counter turns red
 * to warn the visitor that the 2,000-character maximum is getting close.
 */
function updateCharacterCount() {
    const currentLength = issueDescription.value.length;
    characterCount.textContent = currentLength + " / 2000 characters";
    characterCount.style.color = currentLength >= 1800 ? "#c82026" : "#666666";
}

/*
 * handleSupportSubmit(event)
 * PURPOSE: Display a demo confirmation when the visitor submits a valid support form.
 * PARAMETER: event is the browser's submit event.
 * HOW IT WORKS:
 * - preventDefault() stops a page reload because this prototype has no server endpoint.
 * - textContent displays a confirmation and style.color makes it green.
 * - reset() clears all form controls, after which updateCharacterCount() resets the
 *   visible counter. The reset event listener also clears the confirmation message.
 */
function handleSupportSubmit(event) {
    event.preventDefault();

    // Reset the fields first. reset() fires the reset event, which clears any
    // previous message; therefore the new confirmation is written after reset().
    supportForm.reset();
    updateCharacterCount();

    supportMessage.textContent =
        "Your support request has been completed for this demonstration. " +
        "Please keep reference number 123456789 for your records.";
    supportMessage.style.color = "#16803c";
}

/*
 * handleSupportReset()
 * PURPOSE: Clear stale confirmation text and restore the counter's default display.
 * HOW IT WORKS: This runs whenever the visitor presses the form's reset button or
 * when reset() is called in JavaScript. It removes the old confirmation and uses
 * updateCharacterCount() to reflect the now-empty description field.
 */
function handleSupportReset() {
    supportMessage.textContent = "";
    updateCharacterCount();
}

// Listen for typing, form submission, and form reset actions.
issueDescription.addEventListener("input", updateCharacterCount);
supportForm.addEventListener("submit", handleSupportSubmit);
supportForm.addEventListener("reset", handleSupportReset);

// Set the correct count immediately when the page opens.
updateCharacterCount();

}

/* ============================== HOME PAGE ================================= */
// The home page currently uses regular HTML links and has no extra JavaScript
// interaction, so no page-specific function needs to run here.
