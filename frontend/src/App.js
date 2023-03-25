import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Graph from "./pages/Graph"
import Login from "./pages/Login"

const App = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/graph" element={<Graph />} />
        </Routes>
    )
}

export default App
