from flask import Blueprint, jsonify, make_response, request
from datetime import date, timedelta
import pandas as pd
import matplotlib.pyplot as plt
import os
import glob
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint('main', __name__)

# AUTHOR: SHISHIR ARCHANA SRIKANTH
def createResponseObject(obj):
    response = jsonify(obj)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# Mimic users table in DB as in-memory array for prototype
users = []

# AUTHOR: SIRI RACHAPPA JARMALE
@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    password = data.get('password')

    if not username or not password or not role:
        return jsonify({'message': 'Some/all of username, role and password are missing'}), 400

    if len(username) < 4 or len(username) > 32:
        return jsonify({'message': 'Username does not conform to length restrictions'}), 400

    if len(password) < 8 or len(password) > 20:
        return jsonify({'message': 'Password does not conform to length restrictions'}), 400

    for user in users:
        if user['username'] == username:
            return jsonify({'message': 'User already exists'}), 409

    passwordHash = generate_password_hash(password, method='sha256')

    user = {'username': username, 'role': role, 'password': passwordHash}
    users.append(user)

    return jsonify({'message': 'User was registered added to DB'}), 201

# AUTHOR: SHISHIR ARCHANA SRIKANTH
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Either/both username or password is missing'}), 400

    for user in users:
        if user['username'] == username:
            if check_password_hash(user['password'], password):
                print(user)
                return jsonify(
                    {'message': 'Login was successful', 'user': {
                        'username': user['username'], 'role': user['role']}}
                ), 200

    return jsonify({'message': 'Invalid username or password. Please retry.'}), 401


@main.route('/sprint_burndown', methods=['GET'])
def sprint_burndown():
    file_dir = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static') + '/*.xlsx'
    file_list = glob.glob(file_dir)
    file = file_list[0]
    df = pd.read_excel(file, sheet_name="SprintData")
    df_project = df.Project.unique()
    project_id = []
    for project_code in df_project:
        project_id.append(project_code)
    return createResponseObject({'Project Codes': project_id})


def create_figure(story_completed, story_planned, project_name):
    file_name = project_name + '.png'
    file_path = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static', file_name)
    figure_title = "Sprint Burndown Chart for " + project_name
    x_axis = story_completed.keys()
    y_axis1 = story_completed.values()
    y_axis2 = story_planned.values()
    plt.switch_backend('Agg')
    plt.plot(x_axis, y_axis1, color='blue', label='Completed Points')
    plt.plot(x_axis, y_axis2, color='red',
             label='Planned Points', linestyle='dashdot')
    plt.xlabel('Sprints')
    plt.ylabel('Story Points')
    plt.legend(loc='upper left')
    plt.title(figure_title)
    plt.plot()
    plt.savefig(file_path)
    plt.close()


@main.route('/sprint_burndown/<project_name>', methods=['GET'])
def sprint_burndown_project_name(project_name):
    file_dir = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static') + '/*.xlsx'
    file_list = glob.glob(file_dir)
    file = file_list[0]
    df = pd.read_excel(file, sheet_name="SprintData")
    df_planning = pd.read_excel(file, sheet_name="SprintPlanning")
    df_project = df.loc[df['Project'] == project_name]
    df_project_plan = df_planning.loc[df_planning['Project'] == project_name]
    sprint_value = df_project.Sprint.unique()
    story_planned = {}
    story_completed = {}
    for i in sprint_value:
        df1 = df_project.loc[df_project['Sprint'] == i]
        df2 = sum(df1['Story Point'])
        df3 = df_project_plan.loc[df_project_plan['Sprint'] == i]
        df4 = sum(df3['StoryPoints'])
        story_completed[i] = df2
        story_planned[i] = df4
    create_figure(story_completed, story_planned, project_name)
    status_code = {201: "Done"}
    return createResponseObject(status_code)


@main.route('/gantt_chart', methods=['GET'])
def gantt_chart():
    file_dir = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static') + '/*.xlsx'
    file_list = glob.glob(file_dir)
    file = file_list[0]
    df_planning = pd.read_excel(file, sheet_name="SprintPlanning")
    schedule_info = {}
    project_code = df_planning.Project.unique()
    for project in project_code:
        df_project = df_planning.loc[df_planning['Project'] == project]
        sprint_value = df_project.Sprint.unique()
        start_date = df_project.loc[df_project['Sprint'] ==
                                    sprint_value[0]].StartDate.iloc[0].strftime('%Y-%m-%d')
        complete_date = df_project.loc[df_project['Sprint'] ==
                                       sprint_value[-1]].CompleteDate.iloc[0].strftime('%Y-%m-%d')
        schedule_info[project] = [start_date, complete_date]
    create_chart(schedule_info)
    status_code = {201: "Done"}
    return createResponseObject(status_code)


def create_chart(schedule_info):
    file_name = 'gantt_chart.png'
    file_path = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static', file_name)
    project_code = []
    start = []
    end = []
    for key in schedule_info.keys():
        project_code.append(key)
    for project in project_code:
        start_date = schedule_info[project][0]
        end_date = schedule_info[project][1]
        start.append(start_date)
        end.append(end_date)
    df = pd.DataFrame(data={"Project": project_code,
                      "Start": start, "End": end})
    df["Start"] = pd.to_datetime(df.Start)
    df["End"] = pd.to_datetime(df.End)
    df["Days"] = df["End"] - df["Start"]
    df["Color"] = plt.cm.Set1.colors[:len(df)]
    plt.style.use("ggplot")
    plt.switch_backend('Agg')
    fig = plt.figure(figsize=(20, 10))
    plt.barh(y=df["Project"], left=df["Start"],
             width=df["Days"], color=df["Color"])
    current_date = date.today()
    text_date = current_date + timedelta(days=5)
    plt.vlines(x=current_date, ymin=-0.5, ymax=5,
               colors="dodgerblue", linestyles="dashed", linewidth=5)
    plt.text(x=text_date, y=4, s="Today", fontsize=20,
             fontweight="bold", color="black")
    plt.xlim(date(2023, 1, 1), date(2023, 12, 31))
    plt.ylim(-0.5, 5)
    dt_rng = pd.date_range(start="2023-1-1", end="2023-12-31", freq="MS")
    plt.xticks(dt_rng, [dt.month_name() for dt in dt_rng], fontsize=15)
    plt.yticks(fontsize=15)
    plt.xlabel("Date", fontsize=20, fontweight="bold", labelpad=10)
    plt.ylabel("Project", fontsize=20, fontweight="bold", labelpad=10)
    plt.title("Gantt Chart", fontsize=30,
              loc="center", pad=20, fontweight="bold")
    plt.plot()
    plt.savefig(file_path)
    plt.close()


@main.route('/get_developers', methods=['GET'])
def get_developers():
    file_dir = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static') + '/*.xlsx'
    file_list = glob.glob(file_dir)
    file = file_list[0]
    df = pd.read_excel(file, sheet_name="SprintData")
    list_developers = df.Developer.unique()
    dev = {"Developers": []}
    for developer in list_developers:
        dev["Developers"].append(developer)
    return createResponseObject(dev)


@main.route('/developer_performance/<developer_name>', methods=['GET'])
def developer_performance(developer_name):
    file_dir = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static') + '/*.xlsx'
    file_list = glob.glob(file_dir)
    file = file_list[0]
    df = pd.read_excel(file, sheet_name="SprintData")
    developers = df.Developer.unique()
    dev_perf = {}
    for developer in developers:
        df_developer = df.loc[df["Developer"] == developer]
        project_code = df_developer.Project.unique()
        project_perf = {}
        for project in project_code:
            df_project = df_developer.loc[df_developer["Project"] == project]
            sum = df_project["Story Point"].sum()
            project_perf[project] = sum
        dev_perf[developer] = project_perf
    create_perf_chart(dev_perf, developer_name)
    status_code = {201: "Done"}
    return createResponseObject(status_code)


def create_perf_chart(dev_perf, developer_name):
    figure_title = "Performance Chart for " + developer_name
    file_name = 'Performance_' + developer_name + '.png'
    figure_path = os.path.join(os.path.abspath(
        os.getcwd()), 'api', 'static', file_name)
    perf_chart = dev_perf[developer_name]
    project_code = []
    story_point = []
    for project in perf_chart.keys():
        project_code.append(project)
    for point in perf_chart.values():
        story_point.append(point)
    df = pd.DataFrame(data={"Project": project_code,
                      "StoryPoint": story_point})
    plt.style.use("ggplot")
    plt.switch_backend('Agg')
    fig = plt.figure(figsize=(20, 10))
    x_axis = project_code
    y_axis = story_point
    plt.xticks(fontsize=15)
    plt.yticks(fontsize=15)
    plt.plot(x_axis, y_axis, color='blue', label='Completed Points',
             linewidth=4, linestyle="dashdot")
    plt.xlabel("Project Codes", fontsize=20,
               fontweight="bold", labelpad=10, color="black")
    plt.ylabel("Story Points", fontsize=20,
               fontweight="bold", labelpad=10, color="black")
    plt.ylim(0, 40)
    plt.title(figure_title, fontsize=30,
              loc="center", pad=20, fontweight="bold")
    plt.savefig(figure_path)
