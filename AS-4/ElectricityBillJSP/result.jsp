<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%
    String name = request.getParameter("name");
    String unitsStr = request.getParameter("units");
    double units = 0;
    try {
        units = Double.parseDouble(unitsStr);
        if (units < 0) units = 0;
    } catch (Exception e) {
        units = 0;
    }

    double bill = 0.0;
    double remaining = units;

    double slab1 = Math.min(remaining, 50);
    bill += slab1 * 3.5;
    remaining -= slab1;

    if (remaining > 0) {
        double slab2 = Math.min(remaining, 100);
        bill += slab2 * 4.0;
        remaining -= slab2;
    }

    if (remaining > 0) {
        double slab3 = Math.min(remaining, 100);
        bill += slab3 * 5.2;
        remaining -= slab3;
    }

    if (remaining > 0) {
        bill += remaining * 6.5;
    }

    String total = String.format("%.2f", bill);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bill Result</title>
    <link rel="stylesheet" href="css/style.css" />
</head>
<body>
<main class="card">
    <h1>Bill Summary</h1>
    <div class="result">
        <p><strong>Customer:</strong> <%= (name == null || name.trim().isEmpty()) ? "--" : name %></p>
        <p><strong>Units Consumed:</strong> <%= (int) units %></p>
        <p><strong>Total Amount:</strong> Rs. <%= total %></p>
    </div>
    <a href="index.jsp" class="btn-link">Calculate Again</a>
</main>
</body>
</html>
