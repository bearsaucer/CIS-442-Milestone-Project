<?php
session_start();

define('DB_HOST', 'csdb.brockport.edu');
define('DB_USER', 'hchau1');
define('DB_PASSWORD', '_fal26_1');
define('DB_NAME', 'fal26_cis442_hchau1');

$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
OR die('Connection error');

if (!$dbc) {
    die("Connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($dbc, 'utf8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sign up
    if (isset($_POST['signupEmail'])) {
        $companyName     = trim($_POST['companyName'] ?? '');
        $email           = strtolower(trim($_POST['signupEmail'] ?? ''));
        $password        = $_POST['signupPassword'] ?? '';
        $confirmPassword = $_POST['confirmPassword'] ?? '';

        if ($companyName === '' || $email === '' || $password === '' || $confirmPassword === '') {
            die("Invalid sign-up data");
        }

        if ($password !== $confirmPassword) {
            die("Passwords do not match");
        }

        $stmt = mysqli_prepare($dbc, "INSERT INTO users (company_name, email, password) VALUES (?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "sss", $companyName, $email, $password);

        if (mysqli_stmt_execute($stmt)) {
            $newId = mysqli_insert_id($dbc);
            $result = mysqli_query($dbc, "SELECT id, company_name, email FROM users WHERE id = $newId");
            $user = mysqli_fetch_assoc($result);

            // Save user info in the session
            $_SESSION['user_id']      = $user['id'];
            $_SESSION['company_name'] = $user['company_name'];
            $_SESSION['email']        = $user['email'];

            print "<h1>Account created</h1>";
            print "ID: " . htmlspecialchars($user['id']) . "<br />";
            print "Company: " . htmlspecialchars($user['company_name']) . "<br />";
            print "Email: " . htmlspecialchars($user['email']) . "<br />";
        } else {
            print "<h1>Error creating account</h1>";
        }

        mysqli_stmt_close($stmt);
    }

    // Log in
    elseif (isset($_POST['loginEmail'])) {
        $email    = strtolower(trim($_POST['loginEmail'] ?? ''));
        $password = $_POST['loginPassword'] ?? '';

        if ($email === '' || $password === '') {
            die("Invalid login data");
        }

        $stmt = mysqli_prepare($dbc, "SELECT id, company_name, email, password FROM users WHERE email = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        if ($user && $password === $user['password']) {
            // Save user info in the session
            $_SESSION['user_id']      = $user['id'];
            $_SESSION['company_name'] = $user['company_name'];
            $_SESSION['email']        = $user['email'];

            print "<h1>Logged in</h1>";
            print "Welcome, " . htmlspecialchars($user['company_name']) . "<br />";
            print "Email: " . htmlspecialchars($user['email']) . "<br />";
        } else {
            print "<h1>Invalid email or password</h1>";
        }
    }
}

mysqli_close($dbc);

print "<br /><a href='login.html'>Back to login</a>";
print "<br /><a href='index.html'>Homepage</a>";

?>
