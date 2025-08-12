<script lang="ts" setup>
import avatar1 from '../../../assets/images/avatars/avatar-1.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()

const activeTab = ref(route.params.tab)

const accountData = {
  avatarImg: avatar1,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  org: 'ThemeSelection',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'Admin',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}

const refInputEl = ref<HTMLElement>()

const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)

const { user } = useAuth() as {
  user: Ref<{ id: string; username: string; role: string } | null>
}
const currentUserId = user.value?.id
const showPassword = ref(false)

const router = useRouter()
const form = ref({
  username: '',
  role: '',
  password: ''
})

const editable = ref({
  username: false,
  password: false,
  role: false
})


onMounted(async () => {
  try {
    const data = await useAuthFetch<{ username: string; role: string }>(
      `http://localhost:3030/users/${currentUserId}`
    )
    form.value.username = data.username
    form.value.role = data.role
  } catch (err) {
    console.error('Error fetching user data:', err)
  }
})

const updateAccount = async () => {
  try {
    await useAuthFetch(`http://localhost:3030/users/${currentUserId}`, {
      method: 'patch',
      body: {
        username: form.value.username,
        role: form.value.role,
        ...(form.value.password && { password: form.value.password })
      }
    })
    alert('Account updated successfully!')
    router.push('/admin')
  } catch (err) {
    console.error('Update failed:', err)
  }
}

const deleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account?')) {
    try {
      await useAuthFetch(`http://localhost:3030/users/${currentUserId}`, {
        method: 'delete'
      })
      alert('Account deleted')
      router.push('/')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}


const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

// changeAvatar function
const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatarImg = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
}

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard  title="Account Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="accountDataLocal.avatarImg"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-8">
            <div class="d-flex flex-wrap ">
              <VBtn
                color="primary"
                class="me-2 mb-2"
                style="letter-spacing: normal"
                @click="refInputEl?.click()">
                <VIcon
                  append-iiner-icon="ri-upload-cloud-line"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="error"
                variant="outlined"
                style="letter-spacing: normal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="ri-refresh-line"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="form.username"
                  placeholder="John"
                  label="User Name"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  variant="outlined"
                  density="comfortable"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="form.role"
                  label="Role"
                  :items="['admin', 'Moderator', 'User']"
                  placeholder="Select Role"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap"
                
              >
                <VBtn class="me-2" @click="updateAccount" style="letter-spacing: normal">Save changes</VBtn>

                <VBtn
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  style="letter-spacing: normal"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Deactivate Account -->
      <VCard title="Deactivate Account">
        <VCardText>
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              label="I confirm my account deactivation"
            />
          </div>

          <VBtn
            :disabled="!isAccountDeactivated"
            color="error"
            class="mt-3"
            style="letter-spacing: normal"
            @click="deleteAccount"
          >
            Deactivate Account
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
