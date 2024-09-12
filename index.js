<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google OAuth Example</title>
</head>
<body>
  <h1>Google OAuth Example</h1>

  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
    <p>Email: <%= user.email %></p>
    <img src="<%= user.picture %>" alt="Profile Picture">
    <a href="/logout">Logout</a>
  <% } else { %>
    <a href="/auth/google">Login with Google</a>
  <% } %>
</body>
</html>
