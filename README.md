# Setup Instructions

## Backend Flask Server

1. `python3 api/__init__.py` to run the flask API backend

2. `cd frontend && npm install` to install NPM dependencies for frontend 

3. Add a file `.env` to /frontend and include variable `REACT_APP_CLIENT_ID=<your-google-oauth-client-id>`

4. `npm start` to start the frontend dev server


# General Information

- api/static folder contains the excel file with data along with graph generated
- route.py has 2 routes for generating sprint burndown charts. 
  - "/sprint_burndown" route gives us JSON response with all project codes in the excel. User will then select the project code for which they want to generate the chart, 
  - "/sprint_burndown/<project_name> will handle the request and create the chart for the given project code.
