import React, { useEffect, useState } from "react"
import "./App.css"

const App = () => {
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState(null)

    useEffect(() => {
        fetch("/sprint_burndown").then((response) => {
            response.json().then((data) => {
                setProjects(data["Project Codes"])
            })
        })
    }, [])

    const handleProjectButton = (project) => {
        setProject(project)
    }

    return (
        <div className="App">
            <div>Choose a project</div>
            {projects.map((project) => {
                return (
                    <button
                        onClick={() => {
                            console.log(project)
                            handleProjectButton(project)
                        }}
                    >
                        {project}
                    </button>
                )
            })}
            <div>
                {project ? (
                    <img src={`http://localhost:5000/static/${project}.png`} />
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

export default App
