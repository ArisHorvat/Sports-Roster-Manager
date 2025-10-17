import './MyButton.css'

function MyButton(props){
    return(
        <div className="button-container">
            <button className="button-box" onClick={props.onClick}>
                <h1 className="button-text">{props.text}</h1>
            </button>
        </div>
    )
}

export default MyButton;