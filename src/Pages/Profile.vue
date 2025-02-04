<script lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import axios from 'axios'
import router from '@/routers'
import Pagination from '@/components/Pagination.vue'

export default {
	name: 'Profile',
	components: { Pagination },
	methods: {
		router() {
			return router
		},
	},
	setup() {
		const user = useUserStore().user
		const password = reactive({
			password: '',
			newPassword: '',
			newPasswordVerification: '',
		})
		const paging = ref()
		const isDataLoaded = ref(false)
		const deleteButton = useTemplateRef('deleteButton')
		const deleteInput = useTemplateRef('deleteInput')
		const deleteInputData = ref()
		const error = reactive({
			name: '',
			password: '',
		})

		const getBlogs = async (page: 1) => {
			const { data } = await axios.get(`/users/${user.id}/blogs?page=${page}`)

			console.log(data)
			paging.value = data.meta.pagination
			user.blogs = data.data

			isDataLoaded.value = true
		}

		const changeUserName = async () => {
			try {
				await axios.put(
					'users/name',
					{
						name: user.name,
					},
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						withCredentials: true,
					},
				)
			} catch (e) {
				error.name = e.response.data
			}
		}
		const changePassword = async () => {
			try {
				await axios.put(
					`/users/password`,
					{
						password: password.password,
						new_password: password.newPassword,
						new_password_verification: password.newPasswordVerification,
					},
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						withCredentials: true,
					},
				)
				await axios.post(`/logout`)
				await router.push('/login')
			} catch (e) {
				error.password = e.response.data
			}
		}
		const deleteUser = async () => {
			if (deleteInputData.value) {
				try {
					await axios.delete(`/users/${user.id}`)
					await axios.post('/logout')
					router.push('/')
				} catch (e) {}
			}
			alert(
				'Do you want to delete this user?\nYour blogs still saved but you cannot edit blogs.\n\n For deleting your user write down: I want delete this user',
			)
			deleteButton.value.disabled = true
			deleteInput.value.hidden = false
			watch(deleteInputData, () => {
				if (deleteInputData.value === 'I want delete this user') {
					deleteButton.value.disabled = false
				} else {
					deleteButton.value.disabled = true
				}
			})
		}
		const deleteBlog = async (id: number) => {
			axios.delete(`/blogs/${id.toString()}`)
		}

		const dateFormatter = (strDate: string) => {
			const parsedDate = Date.parse(strDate)
			const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'long' })
			const formattedDate = formatter.format(parsedDate)
			return formattedDate
		}

		onMounted(() => {
			getBlogs(1)
		})
		return {
			user,
			error,
			getBlogs,
			dateFormatter,
			changePassword,
			changeUserName,
			deleteUser,
			deleteBlog,
			deleteInputData,
			isDataLoaded,
			paging,
			password,
			axios,
			router,
		}
	},
}
</script>

<template>
	<div class="container align-content-center">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow-lg mt-5">
				<div class="card-header">
					<h3 class="text-left font-weight-light">Name</h3>
				</div>

				<div class="card-body">
					<div class="form-floating">
						<input
							v-model="user.name"
							class="form-control"
							id="name"
							name="name"
							type="text"
							placeholder="Name"
						/>
						<label for="name">User Name</label>
					</div>

					<div class="">
						<div class="d-grid">
							<button @click="changeUserName" class="btn btn-primary">Change</button>
						</div>
					</div>
				</div>

				<div id="err" class="small text-danger">{{ error.name }}</div>
			</div>

			<div class="card shadow-lg mt-5">
				<div class="card-header">
					<h3 class="text-left font-weight-light">Password</h3>
				</div>

				<div class="card-body">
					<div class="form-floating">
						<input
							v-model="password.password"
							class="form-control"
							id="oldPassword"
							name="oldPassword"
							type="password"
							placeholder="Old Password"
						/>
						<label for="name">Old Password</label>
					</div>
					<div class="form-floating">
						<input
							v-model="password.newPassword"
							class="form-control"
							id="newPassword"
							name="newPassword"
							type="password"
							placeholder="New Password"
						/>
						<label for="name">New Password</label>
					</div>
					<div class="form-floating">
						<input
							v-model="password.newPasswordVerification"
							class="form-control"
							id="newPasswordVerification"
							name="newPasswordVerification"
							type="password"
							placeholder="New Password Verification"
						/>
						<label for="name">New Password Verification</label>
					</div>

					<div class="">
						<div class="d-grid">
							<button @click="changePassword" class="btn btn-primary">Change</button>
						</div>
					</div>
				</div>

				<div id="err" class="small text-danger">{{ error.password }}</div>
			</div>
		</div>
	</div>

	<div class="d-grid mx-auto card mt-4">
		<div class="card-header">
			<i class="fas fa-table me-1"></i>
			{{ user.name }}'s Blogs
		</div>
		<div class="card-body">
			<table id="datatablesSimple" class="table table-hover">
				<thead class="">
					<tr>
						<th>Image</th>
						<th>Wrote Date</th>
						<th>Title</th>
						<th>Summary</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>Image</th>
						<th>Wrote Date</th>
						<th>Title</th>
						<th>Summary</th>
						<th>Actions</th>
					</tr>
				</tfoot>
				<tbody ref="table">
					<tr v-for="blog in user.blogs">
						<td>
							<div v-if="blog.image">
								<img
									v-if="blog.image[0] === '/'"
									class="card-img-top"
									:src="axios.defaults.baseURL + blog.image"
								/>
								<img v-else class="card-img-top" :src="blog.image" />
							</div>
						</td>
						<td>{{ dateFormatter(blog.CreatedAt) }}</td>
						<td>{{ blog.title }}</td>
						<td>{{ blog.summary }}</td>

						<td>
							<div class="btn-group">
								<router-link :to="'/blogs/' + blog.id.toString()" class="btn btn-primary"
									>Read</router-link
								>
								<router-link :to="'/blogs/editor/' + blog.id.toString()" class="btn btn-dark"
									>Edit</router-link
								>
								<button class="btn btn-danger" @click="deleteBlog">Delete</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<Pagination
				v-if="isDataLoaded"
				:last-page="paging.lastPage"
				@page-changed="getBlogs($event)"
			/>
		</div>
	</div>
	<div>
		<button ref="deleteButton" class="d-grid btn btn-danger" @click="deleteUser">
			DELETE USER
		</button>
		<div class="form-floating" ref="deleteInput" hidden="true">
			<input
				v-model="deleteInputData"
				class="form-control"
				id="deleteInput"
				name="deleteInput"
				type="deleteInput"
				placeholder="I want delete this user"
			/>
			<label for="deleteInput">I want delete this user</label>
		</div>
	</div>
</template>
