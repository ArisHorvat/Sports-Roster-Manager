import './Title.css'

function Title(props){
    return(
        <div className="title-container">
            <div className="title-box">
                <h1 className="title-text" style={{fontSize: props.size}}>{props.text}</h1>
            </div>
        </div>
    )
}

export default Title;