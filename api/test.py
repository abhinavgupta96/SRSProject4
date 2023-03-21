import os

def func():
    file_dir = os.path.join(os.path.abspath(os.getcwd()),'api', 'static')
    print(file_dir)

func()