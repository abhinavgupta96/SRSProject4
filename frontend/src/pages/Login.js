import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import TextArea from "../components/TextArea"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginResponse, setLoginResponse] = useState("")
    const navigate = useNavigate()

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = {
            username,
            password,
        }
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            response.json().then((data) => {
                setLoginResponse(
                    data["message"] + "! Redirecting you to the main page..."
                )
                localStorage.setItem("user", JSON.stringify(data["user"]))
                setTimeout(() => {
                    navigate("/graph")
                }, 3000)
            })
        })
    }

    return (
        <div className="m-4 d-flex justify-content-center">
            <div style={{ width: "300px" }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicusername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mt-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                        />
                    </Form.Group>
                    <div className="mt-4 d-flex justify-content-center">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                    <div className="mt-4">
                        <a href="/register" className="mt-4">
                            Not an user? Register
                        </a>
                    </div>
                    <div className="mt-4">
                        {loginResponse && (
                            <TextArea text={loginResponse} className="" />
                        )}
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Login
