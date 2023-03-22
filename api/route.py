from flask import Blueprint, jsonify, request
import pandas as pd
import matplotlib.pyplot as plt
import os
import glob

main = Blueprint('main', __name__)


def createResponseObject(obj):
    response = jsonify(obj)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


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
    return 'Done', 201
