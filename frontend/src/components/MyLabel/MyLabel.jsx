import './MyLabel.css'

function MyLabel(props){
    return(
        <div className="label-container" style={props.style}>
            <div className="label-box">
                <h1 className="label-text">{props.text}</h1>
            </div>
        </div>
    )
}

export default MyLabel;