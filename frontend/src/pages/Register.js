import React, { useState } from "react"
import { Form, Button } from "react-bootstrap"
import TextArea from "../components/TextArea"

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [registerResponse, setRegisterResponse] = useState("")

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleRoleChange = (event) => {
        setRole(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = {
            username,
            role,
            password,
        }
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            response.json().then((data) => {
                setRegisterResponse(data["message"])
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
                    <Form.Group className="mt-4">
                        <Form.Label>Username</Form.Label>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={handleRoleChange}
                        >
                            <option value="">Select the role</option>
                            <option value="developer">Developer</option>
                            <option value="manager">Manager</option>
                        </select>
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
                        <a href="/login" className="mt-4">
                            Already a user? Login
                        </a>
                    </div>
                    <div className="mt-4">
                        {registerResponse && (
                            <TextArea text={registerResponse} className="" />
                        )}
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Register
