const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

export default function Test() {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(`${API_URL}/file-upload`, {
      method: "POST",
      body: new FormData(e.target),
    })
    console.log(response)
    if (!response.ok) {
      throw new Error("cant be uploaded")
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
