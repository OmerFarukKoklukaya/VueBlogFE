<script lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import router from '@/routers'

export default {
	name: 'RegisterPage',
	setup() {
		const formData = reactive({
			name: '',
			password: '',
			password_verification: '',
		})
		const error = ref('')
		const register = async () => {
			try {
				await axios.post('/register', formData, {
					withCredentials: true,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				})
				await router.push('/login')
			} catch (e) {
				error.value = e.response.data
			}
		}
		return {
			formData,
			register,
			error,
		}
	},
}
</script>

<template>
	<div>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-lg-7">
					<div class="card shadow-lg border-0 rounded-lg mt-5">
						<div class="card-header">
							<h3 class="text-center font-weight-light my-4">Create Account</h3>
						</div>
						<div class="card-body">
							<form id="register-form">
								<div class="form-floating mb-3">
									<input
										v-model="formData.name"
										class="form-control"
										id="name"
										name="name"
										type="name"
										placeholder="User Name"
									/>
									<label for="name">Name</label>
								</div>
								<div class="row mb-3">
									<div class="col-md-6">
										<div class="form-floating mb-3 mb-md-0">
											<input
												v-model="formData.password"
												class="form-control"
												id="password"
												name="password"
												type="password"
												placeholder="password"
											/>
											<label for="password">Password</label>
										</div>
									</div>
									<div class="col-md-6">
										<div class="form-floating mb-3 mb-md-0">
											<input
												v-model="formData.password_verification"
												class="form-control"
												id="password_verification"
												name="password_verification"
												type="password"
												placeholder="Confirm Password"
											/>
											<label for="password_verification">Confirm Password</label>
										</div>
									</div>
								</div>
								<input type="hidden" id="roleAndPermissions" name="roleAndPermissions" value="" />
							</form>
							<div class="mt-4 mb-0">
								<div class="d-grid">
									<button @click="register" class="btn btn-primary">Register</button>
								</div>
							</div>
							<div id="err" class="small text-danger">{{error}}</div>
						</div>
						<div class="card-footer text-center py-3">
							<div class="small"><router-link :to="'/login'">Have an account? Go to login</router-link></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
