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

    $fullName         = trim($_POST['fullName'] ?? '');
    $businessEmail    = strtolower(trim($_POST['businessEmail'] ?? ''));
    $userId           = trim($_POST['userId'] ?? '');
    $issueType        = trim($_POST['issueType'] ?? '');
    $issueDescription = trim($_POST['issueDescription'] ?? '');
    $physicalVisit    = trim($_POST['physicalVisit'] ?? '');

    if (
        $fullName === '' ||
        $businessEmail === '' ||
        $userId === '' ||
        $issueType === '' ||
        $issueDescription === '' ||
        $physicalVisit === ''
    ) {
        die("Invalid support request data");
    }

    $stmt = mysqli_prepare(
        $dbc,
        "INSERT INTO support_tickets (full_name, business_email, user_id, issue_type, issue_description, physical_visit) VALUES (?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "ssssss",
        $fullName,
        $businessEmail,
        $userId,
        $issueType,
        $issueDescription,
        $physicalVisit
    );

    if (mysqli_stmt_execute($stmt)) {
        $ticketId = mysqli_insert_id($dbc);

        print "<h1>Support Request Submitted</h1>";
        print "Reference ID: " . htmlspecialchars($ticketId) . "<br />";
        print "Name: " . htmlspecialchars($fullName) . "<br />";
        print "Email: " . htmlspecialchars($businessEmail) . "<br />";
        print "User ID: " . htmlspecialchars($userId) . "<br />";
        print "Issue Type: " . htmlspecialchars($issueType) . "<br />";
        print "Physical Visit: " . htmlspecialchars($physicalVisit) . "<br />";
    } else {
        print "<h1>Error submitting support request</h1>";
    }

    mysqli_stmt_close($stmt);
}

mysqli_close($dbc);

print "<br /><a href='support.html'>Back to support</a>";
print "<br /><a href='index.html'>Homepage</a>";

?>
