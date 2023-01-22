import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import Send from './assets/send.svg'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import sablogo from './assets/sablogo.png'
import gptlogo from './assets/chatgptlogo.png'
import.meta.env

function App() {

  const ChatStripe = (isAi: boolean, value: string, uniqueId: string) => {
    return (
      <div className="wrapper ${isAi && 'ai'}">
        <div className="chat">
          <div className="profile">
            <img
              src={isAi ? bot : user}
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div ref={ref_ai_message} className="message" id={uniqueId}>{value}</div>
        </div>
      </div>
    )
  }

  const ref_form = useRef<any>(null);
  const ref_container = useRef<any>(null);
  const ref_ai_message = useRef<any>(null);

  const [prompt, setPrompt] = useState<string>("");
  const [chat, setChat] = useState<any[]>([]);

  let loadInterval: any;
  const chatContainer = ref_container.current;

  function Loader(element: Element) {
    (element as Element).textContent = ''

    loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += '.';

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 300);
  }

  function typeText(element: Element, text: string) {
    let index = 0

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        index++;
      } else {
        clearInterval(interval)
      }
    }, 20)
  }

  // generate unique ID for each message div of bot
  // necessary for typing text effect for that specific reply
  // without unique ID, typing text will work on every element
  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uniqueId = generateUniqueId()
    const userChatStripe = ChatStripe(false, prompt, "")
    const botChatStripe = ChatStripe(true, " ", uniqueId);

    setChat([...chat, userChatStripe, botChatStripe])

    // // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // // to clear the textarea input 
    ref_form.current.reset()

  }

  const botResponse = async () => {
    let messageDiv = ref_ai_message.current;

    if (messageDiv != null) {
      messageDiv.innerHTML = "..."
      Loader(messageDiv)
    }

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const response = await fetch(`${import.meta.env.VITE_SERVER_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt
      })
    })

    clearInterval(loadInterval)
    if (messageDiv != null) {
      messageDiv.innerHTML = " "
    }

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

      typeText(messageDiv, parsedData)

    } else {
      const err = await response.text()

      messageDiv.innerHTML = "Something went wrong"
      alert(err)
    }
  }

  useEffect(() => {

    botResponse();

  }, [chat])

  return (
    <div className="app">
      <div>
        <a href="https://sabawyan.tech/" target="_blank">
          <img src={sablogo} className="logo" alt="Sabawyan logo" />
        </a>
        <a href="https://openai.com/" target="_blank">
          <img src={gptlogo} className="logo" alt="Openai logo" />
        </a>
      </div>

      <div ref={ref_container} id="chat_container">
        {
          chat && chat.map((data, i) => {
            return (
              <div>
                {data}
              </div>

            )
          })
        }
      </div>

      <form ref={ref_form} onSubmit={handleSubmit}>
        <textarea name="prompt" onChange={(e) => setPrompt(e.target.value)} rows={1} cols={1} placeholder="Ask ChatGPT here ..."></textarea>
        <button type="submit"><img src={Send} alt="send" /></button>
      </form>
    </div>
  )
}

export default App
