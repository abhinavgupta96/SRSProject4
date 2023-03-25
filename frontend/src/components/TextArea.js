import React from "react"

// AUTHOR: SIRI RACHAPPA JARMALE

const TextArea = ({ text, className }) => {
    return (
        <p className={className}>
            <mark>{text}</mark>
        </p>
    )
}

export default TextArea
