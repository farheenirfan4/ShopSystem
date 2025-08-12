import type { NitroFetchOptions } from 'nitropack'

export const useAuthFetch = async <T = unknown>(
  url: string,
  options: NitroFetchOptions<string> = {}
): Promise<T> => {
  const token = localStorage.getItem('accessToken')

  return await $fetch<T>(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  })
}
