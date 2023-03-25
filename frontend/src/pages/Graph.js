import React, { useEffect, useRef, useState } from "react"
import ButtonList from "../components/ButtonList"
import TextArea from "../components/TextArea"

const IMG_BASE = "http://localhost:5000/static"

const Graph = () => {
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
                if (!chart === "gantt_chart") {
                    fetch(`/sprint_burndown/${chart}`).then((response) => {
                        response.json().then((data) => {
                            if (data[201] == "Done") {
                                setChart(chart)
                            }
                        })
                    })
                } else {
                    setChart(chart)
                }
                return
            }
            case "DEVELOPER": {
                fetch(`/developer_performance/${chart}`).then((response) => {
                    response.json().then((data) => {
                        if (data[201] == "Done") {
                            setChart(`Performance_${chart}`)
                        }
                    })
                })
                return
            }
        }
    }

    return (
        <div className="m-4 d-flex flex-column justify-content-center">
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
        </div>
    )
}

export default Graph