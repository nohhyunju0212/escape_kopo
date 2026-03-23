import { useEffect, useState } from "react"

export default function App() {
  const [health, setHealth] = useState("")
  const [hello, setHello] = useState("")

  useEffect(() => {
    fetch("http://172.29.215.90:8080/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data.status))

    fetch("http://172.29.215.90:8080/api/hello")
      .then((res) => res.json())
      .then((data) => setHello(data.message))
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>React API Test</h1>
      <p>Health: {health}</p>
      <p>Hello: {hello}</p>
    </div>
  )
}
