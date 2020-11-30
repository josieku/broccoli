import React, { useState } from 'react';
import './index.scss';

const API_URL = "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth";

function Modal(props: { show: string; onClose: ()=>void }) {
    const [error, setError] = useState(""); // indicates input error
    const [success, setSuccess] = useState(false); // determines screen displayed
    const [isPosting, setIsPosting] = useState(false); // determines fetching state

    // input controls
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");

    // Clears all states (except isPosting).  Used for clearing input form/exiting modal
    const clearStates = () => {
        setError("");
        setSuccess(false);
        setName("");
        setEmail("");
        setConfirmEmail("");
    }

    // Triggers on button click, validates inputs & fires request
    const onClickSend = () => {
        if (name.length === 0 || email.length === 0 || confirmEmail.length === 0){
            return setError("Please fill in all fields");
        } else if (name.length <= 3){
            return setError("Full Name must have over 3 characters");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return setError("Invalid email");
        } else if (email !== confirmEmail){
            return setError("Second email does not match the first");
        } else {
            return sendRequest();
        }
    }

    // Controls procedures when firing request to backend
    const sendRequest = async () => {
        setError(""); // clear previous error states
        setIsPosting(true); 

        await fetch(API_URL, { // fire post request with json body
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        })
        .then(response => response.json())
        .then(response=>{
            if (response.errorMessage) { // if there is an error
                setError("Error message from server");
            } else { // if error free, clear inputs and move to success screen
                clearStates();
                setSuccess(true);
            }
            setIsPosting(false);
        })
        .catch(() => {
            setError("Error message from server");
            setIsPosting(false);
        })
    }

    // Triggers when the modal background is clicked, or OK button on success screen
    const closeModal = async (e: React.MouseEvent) => {
        e.stopPropagation(); // stops event chain

        if (isPosting) return;

        props.onClose();
        setTimeout(clearStates, 500); // wait for animation to clear
    };

    return (
        <div 
            className={`Modal-container ${props.show}`} 
            style={props.show === "" ? { display: "none"} : {}}
            onClick={closeModal}
            >
            {
                success
                ? <SuccessScreen close={closeModal}/>
                : <RequestForm {...{
                    name, 
                    email, 
                    confirmEmail, 
                    isPosting,
                    error,
                    setName,
                    setEmail,
                    setConfirmEmail,
                    onClickSend
                }}/>
            }
        </div>
    );
}

interface RequestFormProps {
    name: string, 
    setName: (s: string)=>void,
    email: string, 
    setEmail: (s: string)=>void,
    confirmEmail: string, 
    setConfirmEmail: (s: string)=>void,
    onClickSend: ()=>void, 
    isPosting: boolean,
    error: string
}

function RequestForm(props: RequestFormProps) {
    return (
        <div className="Modal-box request" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <h1>Request an invite</h1>
                <div className="divider"/>
                <div className="input-container">
                    <input 
                        className="box" 
                        placeholder="Full Name" 
                        value={props.name} 
                        disabled={props.isPosting}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>props.setName(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input 
                        className="box" 
                        placeholder="Email" 
                        value={props.email}
                        disabled={props.isPosting}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>props.setEmail(e.target.value)}/>
                </div>
                <div className="input-container">
                    <input
                        className="box"
                        placeholder="Confirm Email"
                        value={props.confirmEmail}
                        disabled={props.isPosting}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>props.setConfirmEmail(e.target.value)}/>
                </div>
                <button 
                    className="box" 
                    onClick={props.onClickSend}
                    disabled={props.isPosting}>
                    {props.isPosting ? "Sending, please wait..." : "Send"}
                </button>
                <div className="input-container error">
                    {
                        props.error.length > 0 && !props.isPosting
                        ? <p>{props.error}</p>
                        : null
                    }
                </div>

            </div>
    )
}

function SuccessScreen(props: {close: (e:React.MouseEvent)=>void}) {
    return (
        <div className="Modal-box success" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <h1>All done!</h1>
                <div className="divider"/>
                <p>You'll be one of the first to experience Broccoli {"&"} Co. when we launch.</p>
                <button 
                    className="box" 
                    onClick={(e: React.MouseEvent)=>props.close(e)}>
                    OK
                </button>
            </div>
    )
}


export default Modal;
