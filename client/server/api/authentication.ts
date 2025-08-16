export default defineEventHandler(async (event) => {
  // read the request body from frontend
  const body = await readBody(event)

  // forward it to your backend
  const response = await $fetch('https://shop-system-5ow7.vercel.app/authentication', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response
})
