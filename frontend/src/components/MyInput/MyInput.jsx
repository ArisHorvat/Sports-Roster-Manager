import './MyInput.css'
import {useState, useEffect} from 'react'

function MyInput(props){

    return(
        <div className="input-container">
            <h1 className="input-label">{props.text}</h1>
            <input className="input-text" value={props.value} onChange={props.onChange} placeholder={props.placeholder} style={props.style} type={props.type}></input>
        </div>
    )
}

export default MyInput;