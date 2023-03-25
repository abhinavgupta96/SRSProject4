import React, { useEffect, useRef, useState } from "react"
import ButtonList from "../components/ButtonList"
import TextArea from "../components/TextArea"

const IMG_BASE = "http://localhost:5000/static"

const Graph = () => {
    const [charts, setCharts] = useState([])
    const [developers, setDevelopers] = useState([])
    const [chartName, setChart] = useState(null)
    const imgRef = useRef()
    const [role, setRole] = useState("")
    const [username, setUsername] = useState("")
    const [access, setAccess] = useState(null)

    useEffect(() => {
        const { role, username } = JSON.parse(localStorage.getItem("user"))
        setRole(role)
        setUsername(username)
    }, [])

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

    const handleChartDisplay = (chartName, type) => {
        let img = imgRef.current
        img.style.height = "400px"
        img.style.width = "auto"
        setAccess(true)
        switch (type) {
            case "PROJECT": {
                if (!chartName === "gantt_chart") {
                    fetch(`/sprint_burndown/${chartName}`).then((response) => {
                        response.json().then((data) => {
                            if (data[201] == "Done") {
                                setChart(chartName)
                            }
                        })
                    })
                } else {
                    setChart(chartName)
                }
                return
            }
            case "USER": {
                if (role === "developer" && username === chartName) {
                    fetch(`/developer_performance/${chartName}`).then(
                        (response) => {
                            response.json().then((data) => {
                                if (data[201] == "Done") {
                                    setChart(`Performance_${chartName}`)
                                }
                            })
                        }
                    )
                } else {
                    setChart("")
                    setAccess(false)
                    img.style.height = "0px"
                    img.style.width = "0px"
                }
                return
            }
        }
    }

    console.log(`${IMG_BASE}/${chartName}.png`)

    return (
        <div className="m-4 d-flex flex-column justify-content-center">
            <div className="">
                <TextArea
                    text={"Agile Chart Visualization"}
                    className="fw-bold"
                />
                <hr />
                <div className="m-2">
                    <TextArea text={"Choose a chartName"} className="" />
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
                    type="USER"
                />
            </div>
            <div>
                <img
                    ref={imgRef}
                    src={`${IMG_BASE}/${chartName}.png`}
                    width={"0px"}
                    height={"0px"}
                />
            </div>
            {access !== null && !access && (
                <div className="mt-4">
                    <TextArea
                        text={
                            "Sorry, you do not have sufficient permission to view this chart. \
                            We're keeping performance data private for a user"
                        }
                    />
                </div>
            )}
        </div>
    )
}

export default Graph
