const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

export default function Test() {
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${API_URL}/file-upload`, {
        method: "POST",
        body: new FormData(e.target),
      })

      const data = await res.json() // <-- IMPORTANT

      if (!res.ok) {
        console.error("error:", data.msg)
        return
      }

      console.log("Success:", data)
    } catch (err) {
      console.error("Network/Fetch error:", err.message)
    }
  }
  return (
    <div>
      <form
        action=""
        method=""
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <input type="text" name="name" />
        <input type="file" name="somefile" />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}
