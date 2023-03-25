import React from "react"

// AUTHOR: SIRI RACHAPPA JARMALE

const ButtonList = ({ buttons, handleChartDisplay, type }) => {
    return (
        <React.Fragment>
            {buttons.map((button) => {
                return (
                    <button
                        key={button}
                        style={{ maxWidth: "auto", margin: "0 5px" }}
                        onClick={() => {
                            handleChartDisplay(button, type)
                        }}
                        className="btn btn-info"
                    >
                        {button}
                    </button>
                )
            })}
        </React.Fragment>
    )
}

export default ButtonList
