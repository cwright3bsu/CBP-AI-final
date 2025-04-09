
import { useState } from 'react';
import axios from 'axios';

export default function Interview() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const updatedConversation = [...conversation, { role: "user", content: trimmed }];
    setConversation(updatedConversation);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post("/api/interview", { conversation: updatedConversation });
      const reply = res.data.reply;
      setConversation([...updatedConversation, reply]);
    } catch (err) {
      console.error(err);
      setConversation([...updatedConversation, { role: "assistant", content: "⚠️ Error processing response." }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
        {conversation.map((msg, idx) => (
          <p key={idx}><strong>{msg.role === "user" ? "You" : "Traveler"}:</strong> {msg.content}</p>
        ))}
        {loading && <p>Traveler is typing...</p>}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ width: "75%" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>Send</button>
      </form>
    </div>
  );
}
