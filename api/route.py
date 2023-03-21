from flask import Blueprint, jsonify, request
import pandas as pd
import matplotlib.pyplot as plt
import os,glob


main = Blueprint('main', __name__)

@main.route('/sprint_burndown', methods=['GET'])
def sprint_burndown():
    file_dir = os.path.join(os.path.abspath(os.getcwd()),'api', 'static') + '/*.xlsx'
    file_list = glob.glob(file_dir)
    file = file_list[0]
    # file = "/Users/abhinavgupta/Desktop/CourseMaterial/SoftwareRequirement/SRSProject4/api/static/ProjectManagement.xlsx"
    df = pd.read_excel(file, sheet_name="SprintData")
    df_planning = pd.read_excel(file, sheet_name="SprintPlanning")
    sprint_value = df.Sprint.unique()
    story_planned = {}
    story_completed = {}
    for i in sprint_value:
        df1 = df.loc[df['Sprint'] == i]
        df2 = sum(df1['Story Point'])
        df3 = df_planning.loc[df_planning['Sprint'] == i]
        df4 = sum(df3['StoryPoints'])
        story_completed[i] = df2
        story_planned[i] = df4
    create_figure(story_completed,story_planned)
    return 'Done', 201
    
def create_figure(story_completed, story_planned):
        file_path = os.path.join(os.path.abspath(os.getcwd()),'api', 'static','test.png')
        # file_path = "/Users/abhinavgupta/Desktop/CourseMaterial/SoftwareRequirement/SRSProject4/api/static/test.png"
        x_axis = story_completed.keys()
        y_axis1 = story_completed.values()
        y_axis2 = story_planned.values()
        # fig = Figure()
        # plt = fig.add_subplot(1,1,1)
        plt.switch_backend('Agg')
        plt.plot(x_axis, y_axis1, color = 'blue', label = 'Completed Points')
        plt.plot(x_axis, y_axis2, color = 'red', label = 'Planned Points', linestyle = 'dashdot')
        plt.xlabel('Sprints')
        plt.ylabel('Story Points')
        plt.legend(loc='upper left')
        plt.plot()
        plt.savefig(file_path)
        plt.close()

    