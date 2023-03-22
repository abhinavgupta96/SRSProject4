import React, { useEffect, useState } from "react"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
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
        <div className="m-4 d-flex justify-content-center">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
                <div className="App">
                    <div className="mb-2">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log(credentialResponse)
                            }}
                            onError={() => {
                                console.log("Login Failed")
                            }}
                        />
                    </div>
                    <div className="mb-2">Choose a project</div>
                    {projects.map((project) => {
                        return (
                            <button
                                key={project}
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
                            <img
                                src={`http://localhost:5000/static/${project}.png`}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </GoogleOAuthProvider>
        </div>
    )
}

export default App
