<script lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import router from '@/routers'

export default {
  name: 'LoginPage',

  setup(){
    const formData = reactive({
      name: '',
      password: '',
    })
    const error = ref('')
    const login =  async () => {
      try{
        await axios.post(
          "/login",
          {
            name: formData.name,
            password: formData.password,
          },
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true,
          }
        )

        await router.push('/blogs')
      } catch (e) {
        if (e.response && e.response.status === 400) {
          console.log(e.response.data)
          error.value = e.response.data
        }
      }
    }


    return {
      error,
      login,
      formData,
    }
  }
}
</script>

<template>
  <div @keyup.enter="login">
    <div id="layoutAuthentication">
      <div id="layoutAuthentication_content">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5">
              <div class="card shadow-lg border-0 rounded-lg mt-5">
                <div class="card-header">
                  <h3 class="text-center font-weight-light my-4">Login</h3>
                </div>
                <div class="card-body">
                  <form id="login-form">
                    <div class="form-floating mb-3">
                      <input
                        v-model="formData.name"
                        class="form-control"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Name"
                      />
                      <label  for="name">User Name</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        v-model="formData.password"
                        class="form-control"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                      />
                      <label for="password">Password</label>
                    </div>
                  </form>
                  <div class="mt-4 mb-0">
                    <div class="d-grid">
											<button @click="login" class="btn btn-primary">Login</button>
                    </div>
                  </div>
									<div id="err" class="small text-danger">{{error}}</div>
								</div>
                <div class="card-footer text-center py-3">
                  <div class="small"><router-link :to="'/register'">Need an account? Sign up!</router-link></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
