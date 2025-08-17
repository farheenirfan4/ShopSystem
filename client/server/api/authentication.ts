export default defineEventHandler(async (event) => {
  // read the request body from frontend
  const body = await readBody(event)

  // forward it to your backend
  const response = await $fetch('http://localhost:3030/authentication', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response
})
