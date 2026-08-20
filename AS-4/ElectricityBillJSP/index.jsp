<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Electricity Bill Calculator</title>
    <link rel="stylesheet" href="css/style.css" />
</head>
<body>
<main class="card">
    <h1>Electricity Bill Calculator</h1>
    <form action="result.jsp" method="post" id="billForm">
        <label for="name">Customer Name</label>
        <input type="text" id="name" name="name" placeholder="Enter name" required />

        <label for="units">Units Consumed</label>
        <input type="number" id="units" name="units" min="0" step="1" placeholder="0" required />

        <button type="submit">Calculate</button>
    </form>
    <p class="note">Rates: First 50 @ Rs. 3.50/unit, next 100 @ Rs. 4.00/unit, next 100 @ Rs. 5.20/unit, above 250 @ Rs. 6.50/unit</p>
</main>
</body>
</html>
