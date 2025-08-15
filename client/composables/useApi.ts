const config = useRuntimeConfig();


export const useApi = () => {
  const baseUrl = `${config.public.apiUrl}` // 🔁 Change if needed

  const post = async (endpoint: string, data: any) => {
    try {
      const res = await $fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return res
    } catch (error: any) {
      throw error.data || error
    }
  }

  return { post }
}
