import { useState } from "react";
import axios from "axios";

export default function App() {
  // Create our prompt use state
  const [prompt, setPrompt] = useState("");
  //const [response, setResponse] = useState("");
  const [error, setError] = useState("ERROR!");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    //setResponse("");

    try {
      const response = await axios.post("http://localhost:3001/api/generate", {
        prompt,
      });

      const data = response.data;
      if (data.reply) {
        const userMessage = { sender: "user", text: prompt };
        const aiMessage = { sender: "ai", text: data.reply };
        setMessages([...messages, userMessage, aiMessage]);
        //setResponse(data.reply);
        setPrompt("");
      } else {
        throw new Error("Unexpected response format from server");
      }
    } catch (error) {
      console.log("There was an error:", error);
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <div className="header-container">
          <h1 className="text-center my-4">Sigmund</h1>
          <p>The Sigma School Chatbot</p>
        </div>
      </div>
      <div className="row col-lg-12">
        <div className="form-container">
          {messages.map((msg, index) => {
            return (
              <div key={index} className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            );
          })}
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(event) => {
              setPrompt(event.target.value);
            }}
            value={prompt}
            className="form-control row"
            placeholder="Type your message..."
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        {/* {response && <div className="mt-4 alert alert-success">{response}</div>} */}
        {error && <div className="mt-4 alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}
