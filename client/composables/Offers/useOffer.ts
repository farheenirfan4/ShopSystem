import { ref } from "vue"
import { offersSchema, type Offer } from "../../schemas/offerSchema"
import { useAuth } from "../Authentication/useAuth" // <-- get token from here



// Setup AJV


//const API_URL = "http://localhost:3030/offers"

export function useOffers() {
  const { token } = useAuth() // ✅ get token directly

  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token.value}`, 
  })

  // 1️⃣ Retrieve all offers
  const fetchOffers = async () => {
    const config = useRuntimeConfig();
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${config.public.apiUrl}/offers`, {
        headers: getHeaders(),
      })
      if (!res.ok) throw new Error(`Failed to fetch offers: ${res.statusText}`)
        const json = await res.json()
        offers.value = json.data || []
      //offers.value = await res.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 2️⃣ Add offer
  const addOffer = async (newOffer: Partial<Offer>) => {
    try {
      const config = useRuntimeConfig();
      //validateBeforeSend(n
      // ewOffer)
      const res = await fetch(`${config.public.apiUrl}/offers`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newOffer)
      })
      if (!res.ok) throw new Error(`Failed to add offer: ${res.statusText}`)
      const data = await res.json()
      offers.value.push(data)
      return data
    } catch (err) {
      throw err
    }
  }

  // 3️⃣ Update offer
  const updateOffer = async (id: string, updatedOffer: Offer) => {
    const config = useRuntimeConfig();
    try {
      //validateBeforeSend(updatedOffer)
      const res = await fetch(`${config.public.apiUrl}/offers/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(updatedOffer)
      })
      if (!res.ok) throw new Error(`Failed to update offer: ${res.statusText}`)
      const data = await res.json()
      const index = offers.value.findIndex(o => (o as any)._id === id)
      if (index !== -1) offers.value[index] = data
      return data
    } catch (err) {
      throw err
    }
  }

  // 4️⃣ Delete offer
  const deleteOffer = async (id: string) => {
    const config = useRuntimeConfig();
    try {
      const res = await fetch(`${config.public.apiUrl}/offers/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      })
      if (!res.ok) throw new Error(`Failed to delete offer: ${res.statusText}`)
      offers.value = offers.value.filter(o => (o as any)._id !== id)
    } catch (err) {
      throw err
    }
  }

  return {
    offers,
    loading,
    error,
    fetchOffers,
    addOffer,
    updateOffer,
    deleteOffer
  }
}
