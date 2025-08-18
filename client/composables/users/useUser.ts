import { ref, onMounted, computed } from 'vue';
import { useAuth } from '../../composables/Authentication/useAuth';
import { useRuntimeConfig } from '#app';

//onst config = useRuntimeConfig();


export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

const { token, user } = useAuth(); // get token & user info
//const API_URL = 'http://localhost:3030/users';
const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBase;

const userData = ref<User[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Helper to add headers with JWT
const getHeaders = (isJSON = true) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token.value || ''}`
  };
  if (isJSON) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Fetch all users
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`${config.public.apiUrl}users`, {
      method: 'GET',
      headers: getHeaders(false) 
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    userData.value = Array.isArray(data) ? data : data.data;
  } catch (err) {
    console.error('Failed to fetch users:', err);
    error.value = 'Unable to load users';
  } finally {
    isLoading.value = false;
  }
};



// ✅ Create a new user
const createUser = async (newUser: { username: string; email: string; password: string; roles?: string[] }) => {
  try {
    const res = await fetch(`${config.public.apiUrl}/users`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(newUser)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    userData.value.push(data); // update UI without refetch
  } catch (err) {
    console.error('Failed to create user:', err);
  }
};

// ✅ Update an existing user
const updateUser = async (id: string, updates: Partial<{ username: string; email: string; roles?: string[] }>) => {
  try {
    const res = await fetch(`${config.public.apiUrl}/users/${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const index = userData.value.findIndex((u: any) => u.id === id);
    if (index !== -1) userData.value[index] = data;
  } catch (err) {
    console.error('Failed to update user:', err);
  }
};

// ✅ Delete a user
const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${config.public.apiUrl}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    if (!res.ok) throw new Error(await res.text());
    userData.value = userData.value.filter((u: any) => u.id !== id);
  } catch (err) {
    console.error('Failed to delete user:', err);
  }
};

// Optional: Role-based access check
export const canManageUsers = computed(() => user.value?.roles?.includes('admin'));

// Auto-load users on mount


export {
  userData,
  isLoading,
  error,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
};
