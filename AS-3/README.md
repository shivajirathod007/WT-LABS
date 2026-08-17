# AS-3 Electricity Bill Calculator

A responsive Servlet-based electricity bill calculator.

## Slab Rates

- First 50 units: Rs. 3.50/unit
- Next 100 units: Rs. 4.00/unit
- Next 100 units: Rs. 5.20/unit
- Above 250 units: Rs. 6.50/unit

## Run

Deploy the project as a WAR on Tomcat 9 or any Servlet container that supports `javax.servlet`.

Build:

```bash
mvn clean package
```

Then deploy the generated WAR from `target/as-3-electricity-bill.war`.
