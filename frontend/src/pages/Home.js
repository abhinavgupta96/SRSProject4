import React from "react"
import TextArea from "../components/TextArea"

// AUTHOR: SIRI RACHAPPA JARMALE

const Home = () => {
    return (
        <div className="m-4 d-flex flex-column align-items-center">
            <TextArea text={"Welcome to Agile Project Management Tool"} />
            <div className="mt-4">
                <a href="/register">New to this? Register!</a>
            </div>
            <div className="mt-2">
                <a href="/login">Already a user? Login!</a>
            </div>
        </div>
    )
}

export default Home
