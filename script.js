// This JavaScript file is shared by all the pages in Kodak Business Hub.

// Checks whether the visitor is currently on the login page.
const isLoginPage = Boolean(document.getElementById("login-form"));

// All pages except login.html require the visitor to sign in first.
if (!isLoginPage) {
    // Gets the email address saved when the visitor signed in.
    const signedInEmail = sessionStorage.getItem("kodakBusinessSignedInEmail");

    // If no email is saved, send the visitor to the login page.
    if (!signedInEmail) {
        // replace() sends the visitor to login.html.
        window.location.replace("login.html");
    }
}

/* Login page (login.html): handles signing in and creating an account. */

// Checks whether the login and sign-up forms exist on this page.
if (document.getElementById("login-form") && document.getElementById("signup-form")) {

    // Finds the screen where the visitor chooses Log In or Sign Up.
    const accountOptions = document.getElementById("account-options");

    // Finds the section that contains the login form.
    const loginSection = document.getElementById("login-section");

    // Finds the section that contains the sign-up form.
    const signupSection = document.getElementById("signup-section");

    // Finds the login form so JavaScript can handle its submission.
    const loginForm = document.getElementById("login-form");

    // Finds the sign-up form so JavaScript can handle its submission.
    const signupForm = document.getElementById("signup-form");

    // Finds the area where login messages will appear.
    const loginMessage = document.getElementById("login-message");

    // Finds the area where sign-up messages will appear.
    const signupMessage = document.getElementById("signup-message");

    // Shows the login form and hides the other sections.
    function showLoginForm() {
        accountOptions.hidden = true;
        loginSection.hidden = false;
        signupSection.hidden = true;

        // Clears any old login message.
        loginMessage.textContent = "";
    }

    // Shows the sign-up form and hides the other sections.
    function showSignupForm() {
        accountOptions.hidden = true;
        loginSection.hidden = true;
        signupSection.hidden = false;

        // Clears any old sign-up message.
        signupMessage.textContent = "";
    }

    // Returns the visitor to the screen where they choose Log In or Sign Up.
    function returnToAccountChoices() {
        accountOptions.hidden = false;
        loginSection.hidden = true;
        signupSection.hidden = true;

        // Clears any messages from the forms.
        loginMessage.textContent = "";
        signupMessage.textContent = "";
    }

    // Checks the sign-up information and creates a demo account.
    function handleSignupSubmit(event) {
        // Stops the form from refreshing the page when submitted.
        event.preventDefault();

        // Gets the company name and removes extra spaces at the beginning and end.
        const companyName = document.getElementById("company-name").value.trim();

        // Gets the email, removes extra spaces, and changes it to lowercase.
        const email = document.getElementById("signup-email").value.trim().toLowerCase();

        // Gets the password entered by the visitor.
        const password = document.getElementById("signup-password").value;

        // Gets the password entered in the confirmation field.
        const confirmPassword = document.getElementById("confirm-password").value;

        // Checks whether both password fields contain the same password.
        if (password !== confirmPassword) {
            signupMessage.textContent = "The passwords do not match. Please try again.";
            return;
        }

        // Creates a unique storage key using the visitor's email address.
        const storageKey = "kodakBusinessAccount-" + email;

        // Checks whether an account already exists for this email.
        const existingAccount = localStorage.getItem(storageKey);

        // Prevents another account from being created with the same email.
        if (existingAccount !== null) {
            signupMessage.textContent =
                "An account already exists for this email. Please log in instead.";
            return;
        }

        // Collects the new account information into one object.
        const account = {
            companyName: companyName,
            email: email,
            password: password
        };

        // Saves the account information in the browser for this demonstration.
        localStorage.setItem(storageKey, JSON.stringify(account));

        // Saves the signed-in email for the current browser session.
        sessionStorage.setItem("kodakBusinessSignedInEmail", email);

        // Opens the homepage after the account is created.
        window.location.href = "index.html";
    }

    // Checks the visitor's email and password when they try to log in.
    function handleLoginSubmit(event) {
        // Stops the form from refreshing the page when submitted.
        event.preventDefault();

        // Gets the email, removes extra spaces, and changes it to lowercase.
        const email = document.getElementById("login-email").value.trim().toLowerCase();

        // Gets the password entered by the visitor.
        const password = document.getElementById("login-password").value;

        // Uses the email to find the account saved in the browser.
        const storageKey = "kodakBusinessAccount-" + email;

        // Looks for the saved account information.
        const savedAccountText = localStorage.getItem(storageKey);

        // Shows a message if no account exists for this email.
        if (savedAccountText === null) {
            loginMessage.textContent =
                "No account was found for that email. Please sign up first.";
            return;
        }

        // Creates a variable to hold the account information.
        let savedAccount;

        try {
            // Converts the saved account information back into a JavaScript object.
            savedAccount = JSON.parse(savedAccountText);
        } catch (error) {
            // Shows a message if the saved account information cannot be read.
            loginMessage.textContent =
                "The saved demo account could not be read. Please sign up again.";
            return;
        }

        // Checks whether the entered password matches the saved password.
        if (savedAccount.password !== password) {
            loginMessage.textContent = "The password is incorrect. Please try again.";
            return;
        }

        // Saves the email to show that the visitor is signed in.
        sessionStorage.setItem("kodakBusinessSignedInEmail", email);

        // Opens the homepage after a successful login.
        window.location.href = "index.html";
    }

    // Shows the login form when the visitor clicks the Log In button.
    document.getElementById("show-login").addEventListener("click", showLoginForm);

    // Shows the sign-up form when the visitor clicks the Sign Up button.
    document.getElementById("show-signup").addEventListener("click", showSignupForm);

    // Switches from the login form to the sign-up form.
    document.getElementById("login-to-signup").addEventListener("click", showSignupForm);

    // Switches from the sign-up form to the login form.
    document.getElementById("signup-to-login").addEventListener("click", showLoginForm);

    // Runs the sign-up function when the sign-up form is submitted.
    signupForm.addEventListener("submit", handleSignupSubmit);

    // Runs the login function when the login form is submitted.
    loginForm.addEventListener("submit", handleLoginSubmit);
}

/* Orders page (orders.html): displays current orders and past orders. */

// Checks whether the Current Orders and Past Orders buttons exist on this page.
if (
    document.getElementById("current-orders-button") &&
    document.getElementById("past-orders-button")
) {
    /*
     * Current orders use id, product, orderDate, and trackingNumber.
     * Past orders use id, product, orderDate, and deliveryAddress.
     */

    // Holds the current orders displayed in the table.
    const currentOrders = [];

    // Holds the past orders displayed in the table.
    const pastOrders = [];

    // Finds the button used to display current orders.
    const currentButton = document.getElementById("current-orders-button");

    // Finds the button used to display past orders.
    const pastButton = document.getElementById("past-orders-button");

    // Finds the section where current orders are displayed.
    const currentPanel = document.getElementById("current-orders-panel");

    // Finds the section where past orders are displayed.
    const pastPanel = document.getElementById("past-orders-panel");

    // Shows the selected order section and updates the buttons.
    function showOrders(type) {
        // Checks whether the visitor selected Current Orders.
        const showCurrent = type === "current";

        // Shows or hides the current orders section.
        currentPanel.hidden = !showCurrent;

        // Shows or hides the past orders section.
        pastPanel.hidden = showCurrent;

        // Highlights the selected button.
        currentButton.classList.toggle("selected", showCurrent);
        pastButton.classList.toggle("selected", !showCurrent);

        // Updates these attributes to show which button is selected.
        currentButton.setAttribute("aria-pressed", String(showCurrent));
        pastButton.setAttribute("aria-pressed", String(!showCurrent));

        // Displays the current orders table when Current Orders is selected.
        if (showCurrent) {
            displayOrders(
                currentOrders,
                "current-orders-table",
                "no-current-orders",
                "current-orders-container",
                "current"
            );
        } else {
            // Displays the past orders table when Past Orders is selected.
            displayOrders(
                pastOrders,
                "past-orders-table",
                "no-past-orders",
                "past-orders-container",
                "past"
            );
        }
    }

    // Fills the correct table or displays "No orders found" if the list is empty.
    function displayOrders(orders, tableId, messageId, containerId, type) {
        // Finds the part of the table where order rows will be added.
        const tableBody = document.getElementById(tableId);

        // Finds the message shown when there are no orders.
        const emptyMessage = document.getElementById(messageId);

        // Finds the container that holds the order table.
        const tableContainer = document.getElementById(containerId);

        // Removes old table rows before displaying the current information.
        tableBody.replaceChildren();

        // Checks whether the selected order list is empty.
        if (orders.length === 0) {
            // Shows the message telling the visitor that no orders were found.
            emptyMessage.hidden = false;

            // Hides the empty table.
            tableContainer.hidden = true;
            return;
        }

        // Hides the message because there are orders to display.
        emptyMessage.hidden = true;

        // Shows the section containing the order table.
        tableContainer.hidden = false;

        // Goes through each order in the selected list.
        orders.forEach(function (order) {
            // Creates a new table row for this order.
            const row = document.createElement("tr");

            // Adds the order ID to the row.
            addCell(row, order.id);

            // Adds the product name to the row.
            addCell(row, order.product);

            // Adds the order date to the row.
            addCell(row, order.orderDate);

            // Current orders display their tracking number.
            if (type === "current") {
                addCell(row, order.trackingNumber);
            } else {
                // Past orders display the delivery address instead.
                addCell(row, order.deliveryAddress);
            }

            // Adds the completed row to the order table.
            tableBody.appendChild(row);
        });
    }

    // Adds one cell to a table row and shows a message if its value is missing.
    function addCell(row, value) {
        // Creates a new table cell.
        const cell = document.createElement("td");

        // Displays the value or "Not available" if the value is empty.
        cell.textContent = value || "Not available";

        // Adds the new cell to the selected row.
        row.appendChild(cell);
    }

    // Shows current orders when the Current Orders button is clicked.
    currentButton.addEventListener("click", function handleCurrentOrdersClick() {
        showOrders("current");
    });

    // Shows past orders when the Past Orders button is clicked.
    pastButton.addEventListener("click", function handlePastOrdersClick() {
        showOrders("past");
    });

    // Opens the Current Orders section when the page first loads.
    showOrders("current");
}

/* Products page (products.html): reads the product selected by the visitor. */

// Checks whether the page contains product cards or product information.
if (
    document.querySelector(".product-card") ||
    document.querySelector("[data-product]")
) {
    // Creates a function to read the selected product from the page URL.
    function readSelectedProduct() {
        // Gets the information included after the question mark in the URL.
        const urlParameters = new URLSearchParams(window.location.search);

        // Returns the product name saved in the URL.
        return urlParameters.get("product");
    }

    // Saves the selected product name so the code can use it.
    const selectedProduct = readSelectedProduct();

    // Checks whether the visitor selected a product.
    if (selectedProduct) {
        // Prints the product name in the browser console for testing.
        console.log("Selected product:", selectedProduct);
    }
}

/* Support page (support.html): handles the support form and character counter. */

// Checks whether the support form exists on this page.
if (document.getElementById("support-form")) {
    // Finds the support form.
    const supportForm = document.getElementById("support-form");

    // Finds the area where the submission confirmation will appear.
    const supportMessage = document.getElementById("support-message");

    // Finds the text box where the visitor describes their issue.
    const issueDescription = document.getElementById("issue-description");

    // Finds the area that displays the character count.
    const characterCount = document.getElementById("character-count");

    // Updates the character count as the visitor types.
    function updateCharacterCount() {
        // Counts the characters currently entered in the description box.
        const currentLength = issueDescription.value.length;

        // Displays the current count out of the 2000-character limit.
        characterCount.textContent = currentLength + " / 2000 characters";

        // Turns the counter red when the visitor has entered 1800 characters or more.
        characterCount.style.color =
            currentLength >= 1800 ? "#c82026" : "#666666";
    }

    // Handles the support form submission for this website demonstration.
    function handleSupportSubmit(event) {
        // Stops the form from refreshing the page.
        event.preventDefault();

        // Clears the form fields after submission.
        supportForm.reset();

        // Resets the character counter to match the empty description box.
        updateCharacterCount();

        // Displays a confirmation message with the support reference number.
        supportMessage.textContent =
            "Your support request has been completed for this demonstration. " +
            "Please keep reference number 123456789 for your records.";

        // Makes the confirmation message green.
        supportMessage.style.color = "#16803c";
    }

    // Clears the confirmation message when the visitor resets the form.
    function handleSupportReset() {
        supportMessage.textContent = "";

        // Updates the character counter after the form is cleared.
        updateCharacterCount();
    }

    // Updates the character count whenever the visitor types.
    issueDescription.addEventListener("input", updateCharacterCount);

    // Runs the submission function when the support form is submitted.
    supportForm.addEventListener("submit", handleSupportSubmit);

    // Runs the reset function when the visitor clears the form.
    supportForm.addEventListener("reset", handleSupportReset);

    // Displays the correct character count when the support page opens.
    updateCharacterCount();
}