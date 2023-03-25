# Setup Instructions

## Backend Flask Server

1. `python3 api/__init__.py` to run the flask API backend

2. `cd frontend && npm install` to install NPM dependencies for frontend 

3. `npm start` to start the frontend dev server


# General Information

- api/static folder contains the excel file with data along with graph generated
- route.py has multiple routes for generating charts which can help in Project Management initiatives. 
  - "/sprint_burndown" route gives us JSON response with all project codes in the excel. User will then select the project code for which they want to generate the chart, 
  - "/sprint_burndown/<project_name> will handle the request and create the chart for the given project code.
  - "/gantt_chart" will handle request to help create a gantt chart bsaed on the given data.
  - "/get_developers" will list all the developers mentioned in the data file
  - "/developer_performance/<developer_name>" will create charts to map out developer performance based on the story points that the developer has contributed towards a specific project code.
