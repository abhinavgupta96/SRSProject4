import React from "react"

const TextArea = ({ text, className }) => {
    return (
        <p className={className}>
            <mark>{text}</mark>
        </p>
    )
}

export default TextArea
