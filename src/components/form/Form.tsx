import './style_form.css'
import Send from '../../assets/send.svg'
import { useState } from 'react'

function Form() {


    const [inputPrompt, setInputPrompt] = useState("");

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea name="prompt" onChange={(e) => setInputPrompt(e.target.value)} rows={1} cols={1} placeholder="ask chat gpt ..."></textarea>
                <button type="submit"><img src={Send} alt="send" /></button>
            </form>
        </div>
    )
}

export default Form
