import React, { useEffect, useRef, useState } from "react"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import "./App.css"
import ButtonList from "./components/ButtonList"
import TextArea from "./components/TextArea"

const IMG_BASE = "http://localhost:5000/static"

const App = () => {
    const [charts, setCharts] = useState([])
    const [developers, setDevelopers] = useState([])
    const [chart, setChart] = useState(null)
    const imgRef = useRef()

    useEffect(() => {
        fetch("/sprint_burndown").then((response) => {
            console.log(response)
            response.json().then((data) => {
                console.log(data["Project Codes"])
                setCharts((charts) => [...charts, ...data["Project Codes"]])
            })
        })
    }, [])

    useEffect(() => {
        fetch("/gantt_chart").then((response) => {
            response.json().then((data) => {
                console.log("HELLO")
                if (data[201] == "Done") {
                    setCharts((charts) => [...charts, "gantt_chart"])
                }
            })
        })
    }, [])

    useEffect(() => {
        fetch("/get_developers").then((response) => {
            response.json().then((data) => {
                if (data["Developers"]) {
                    setDevelopers(data["Developers"])
                }
            })
        })
    }, [])

    const handleChartDisplay = (chart, type) => {
        let img = imgRef.current
        img.style.height = "400px"
        img.style.width = "auto"
        switch (type) {
            case "PROJECT": {
                setChart(chart)
                return
            }
            case "DEVELOPER": {
                setChart(`Performance_${chart}`)
                return
            }
        }
    }

    return (
        <div className="m-4 d-flex flex-column justify-content-center">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
                <div className="">
                    <TextArea
                        text={"Agile Chart Visualization"}
                        className="fw-bold"
                    />
                    <hr />
                    <div className="m-2">
                        <TextArea text={"Choose a chart"} className="" />
                    </div>
                    <ButtonList
                        buttons={charts}
                        handleChartDisplay={handleChartDisplay}
                        type="PROJECT"
                    />
                    <hr />
                    <div className="m-2">
                        <TextArea
                            text={
                                "Choose a developer to view their performance chart"
                            }
                            className=""
                        />
                    </div>
                    <ButtonList
                        buttons={developers}
                        handleChartDisplay={handleChartDisplay}
                        type="DEVELOPER"
                    />
                </div>
                <div>
                    <img
                        ref={imgRef}
                        src={`${IMG_BASE}/${chart}.png`}
                        width={"0px"}
                        height={"0px"}
                    />
                </div>
            </GoogleOAuthProvider>
        </div>
    )
}

export default App
