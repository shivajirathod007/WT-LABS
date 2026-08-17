package com.wtlabs.as3;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/calculate")
public class ElectricityBillServlet extends HttpServlet {
  private static final double FIRST_SLAB_RATE = 3.50;
  private static final double SECOND_SLAB_RATE = 4.00;
  private static final double THIRD_SLAB_RATE = 5.20;
  private static final double FOURTH_SLAB_RATE = 6.50;

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    handleRequest(request, response);
  }

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    handleRequest(request, response);
  }

  private void handleRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;charset=UTF-8");

    String unitsValue = request.getParameter("units");
    String customerName = request.getParameter("customerName");

    try (PrintWriter out = response.getWriter()) {
      out.println("<!doctype html>");
      out.println("<html lang='en'>");
      out.println("<head>");
      out.println("<meta charset='UTF-8'>");
      out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
      out.println("<title>Electricity Bill Result</title>");
      out.println("<link rel='stylesheet' href='css/style.css'>");
      out.println("</head>");
      out.println("<body>");
      out.println("<main class='page-shell'>");
      out.println("<section class='result-card'>");
      out.println("<div class='result-header'>");
      out.println("<p class='eyebrow'>WT-3 Assignment</p>");
      out.println("<h1>Electricity Bill Result</h1>");
      out.println("<p class='lead'>Slab-based billing using Servlet.</p>");
      out.println("</div>");

      if (unitsValue == null || unitsValue.trim().isEmpty()) {
        out.println(errorBlock("Please enter the number of units consumed."));
      } else {
        try {
          double units = Double.parseDouble(unitsValue.trim());
          if (units < 0) {
            out.println(errorBlock("Units cannot be negative."));
          } else {
            BillBreakdown bill = calculateBill(units);
            out.println("<div class='bill-summary'>");
            out.println("<p class='customer-name'>" + escapeHtml(customerName) + "</p>");
            out.println("<div class='bill-amount'>Rs. " + formatMoney(bill.total) + "</div>");
            out.println("<p class='bill-units'>Units consumed: " + formatUnits(units) + "</p>");
            out.println("</div>");
            out.println("<div class='breakdown-grid'>");
            out.println(detailCard("First 50 units", formatMoney(bill.firstSlab)));
            out.println(detailCard("Next 100 units", formatMoney(bill.secondSlab)));
            out.println(detailCard("Next 100 units", formatMoney(bill.thirdSlab)));
            out.println(detailCard("Above 250 units", formatMoney(bill.fourthSlab)));
            out.println("</div>");
          }
        } catch (NumberFormatException exception) {
          out.println(errorBlock("Please enter a valid numeric value for units."));
        }
      }

      out.println("<a class='back-link' href='index.html'>Calculate another bill</a>");
      out.println("</section>");
      out.println("</main>");
      out.println("</body>");
      out.println("</html>");
    }
  }

  private BillBreakdown calculateBill(double units) {
    double firstSlab = Math.min(units, 50) * FIRST_SLAB_RATE;
    double secondSlab = 0;
    double thirdSlab = 0;
    double fourthSlab = 0;

    if (units > 50) {
      secondSlab = Math.min(units - 50, 100) * SECOND_SLAB_RATE;
    }

    if (units > 150) {
      thirdSlab = Math.min(units - 150, 100) * THIRD_SLAB_RATE;
    }

    if (units > 250) {
      fourthSlab = (units - 250) * FOURTH_SLAB_RATE;
    }

    return new BillBreakdown(firstSlab, secondSlab, thirdSlab, fourthSlab);
  }

  private String detailCard(String title, String amount) {
    return "<article class='detail-card'><span>" + escapeHtml(title) + "</span><strong>Rs. " + amount + "</strong></article>";
  }

  private String errorBlock(String message) {
    return "<div class='error-box'>" + escapeHtml(message) + "</div>";
  }

  private String formatMoney(double value) {
    return String.format("%.2f", value);
  }

  private String formatUnits(double value) {
    if (Math.floor(value) == value) {
      return String.format("%.0f", value);
    }
    return String.format("%.2f", value);
  }

  private String escapeHtml(String value) {
    if (value == null || value.trim().isEmpty()) {
      return "Anonymous customer";
    }

    return value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#39;");
  }

  private static class BillBreakdown {
    private final double firstSlab;
    private final double secondSlab;
    private final double thirdSlab;
    private final double fourthSlab;
    private final double total;

    private BillBreakdown(double firstSlab, double secondSlab, double thirdSlab, double fourthSlab) {
      this.firstSlab = firstSlab;
      this.secondSlab = secondSlab;
      this.thirdSlab = thirdSlab;
      this.fourthSlab = fourthSlab;
      this.total = firstSlab + secondSlab + thirdSlab + fourthSlab;
    }
  }
}
