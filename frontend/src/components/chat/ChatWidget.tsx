import { useState } from "react"

export default function ChatWidget() {

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola 👋 ¿En qué puedo ayudarte?" }
  ])
  const [input, setInput] = useState("")

  function sendMessage() {

    if (!input.trim()) return

    const newMessages = [
      ...messages,
      { from: "user", text: input }
    ]

    let reply = "No estoy seguro. Puedes escribirnos por WhatsApp."

    if (input.toLowerCase().includes("horario")) {
      reply = "Nuestro horario es de lunes a domingo de 10:00 a 20:00."
    }

    if (input.toLowerCase().includes("envio")) {
      reply = "Realizamos envíos a domicilio."
    }

    setMessages([
      ...newMessages,
      { from: "bot", text: reply }
    ])

    setInput("")
  }

  return (
    <>
      {/* BOTÓN CHAT */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed right-6 z-50 flex items-center justify-center
                   w-14 h-14 rounded-full
                   bg-blue-600 text-white
                   shadow-lg cursor-pointer"
        style={{ bottom: "100px" }}
      >
        💬
      </div>

      {/* VENTANA CHAT */}
      {open && (
        <div
          className="fixed right-6 z-50
                     w-80 h-[420px]
                     bg-white rounded-xl
                     shadow-2xl
                     flex flex-col"
          style={{ bottom: "170px" }}
        >

          <div className="bg-blue-600 text-white p-3 rounded-t-xl">
            Chat soporte
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm">

            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${m.from === "user" ? "text-right" : ""}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg
                    ${m.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"}`}
                >
                  {m.text}
                </span>
              </div>
            ))}

          </div>

          <div className="flex border-t">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 outline-none"
              placeholder="Escribe..."
            />

            <button
              onClick={sendMessage}
              className="px-4 bg-blue-600 text-white"
            >
              →
            </button>

          </div>

        </div>
      )}
    </>
  )
}