<script lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import router from '@/routers'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Pagination from '@/components/Pagination.vue'

export default {
	name: 'AdminUserComponent',
	components: { Pagination },
	setup() {
		const user = reactive({
			id: '',
			name: '',
			password: '',
			roleID: 0,
		})
		const isDataLoaded = ref(false)
		const blogs = ref([])
		const paging = ref()
		const newUser = ref(false)
		const route = useRoute()
		const roles = ref([])
		const error = ref('')

		onMounted(async () => {
			const { data } = await axios.get('/roles')
			roles.value = data.data
			console.log(data)
			if (!route.params.id) {
				newUser.value = true
			}
			else if (parseInt(route.params.id.toString()) > 0) {
				try {
					const { data } = await axios.get('/users/' + route.params.id.toString())
					user.id = data.data.id
					user.name = data.data.name
					user.roleID = data.data.roleID
					await getBlogs(1)
				} catch (err) {
					console.log('Getting User Problem:', err)
				}
			}
			else {
				router.push('/admin/users')
			}
		})

		const getBlogs = async (page: 1) => {
			const { data } = await axios.get(`/users/${user.id}/blogs?page=${page}`)

			console.log(data)
			paging.value = data.meta.pagination
			blogs.value = data.data

			isDataLoaded.value = true
		}
		const addUser = async () => {
			try {
				await axios.post('/users', {
					name: user.name,
					password: user.password,
					role_id: user.roleID,
				}, {
					withCredentials: true,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				})
				await router.push('/admin/users')
			} catch (e) {
				error.value = e.response.data
			}
		}
		const updateUser = async () => {
				try {
					await axios.put('/users/'+user.id.toString(), {
						name: user.name,
						role_id: user.roleID,
					}, {
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					})
					await router.push('/admin/users/'+user.id.toString())
				} catch (e) {
					error.value = e.response.data
				}
		}
		const deleteUser = async (id:Number) => {
				try {
					await axios.delete(`/users/${user.id}`)
					router.push('/admin/users')
				} catch (e) {
					error.value = e.response.data
				}
		}

		const dateFormatter = (strDate: string) => {
			const parsedDate = Date.parse(strDate)
			const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'long' })
			const formattedDate = formatter.format(parsedDate)
			return formattedDate
		}


		return {
			error,
			user,
			roles,
			newUser,
			blogs,
			paging,
			isDataLoaded,
			axios,
			dateFormatter,
			getBlogs,
			addUser,
			updateUser,
			deleteUser,
		}
	},

}
</script>

<template>
	<h1>User</h1>
	<div class="card-body">
		<form id="register-form">
			<div class="form-floating mb-3">
				<input
					v-model="user.name"
					class="form-control"
					id="name"
					name="name"
					type="name"
					placeholder="User Name"
				/>
				<label for="name">Name</label>
			</div>
			<div v-if="newUser" class="form-floating mb-3">
					<div class="form-floating mb-3">
						<input
							v-model="user.password"
							class="form-control"
							id="password"
							name="password"
							type="text"
							placeholder="password"
						/>
						<label for="password">Password</label>
					</div>

			</div>
			<div class="row mb-3">
				<div class="col-md-6">
					<div class="form-floating mb-3">
						<select v-model="user.roleID" id="role_id" class="form-select">
							<option value="0">Select Role</option>
							<option v-for="role in roles" :value="role.id">{{ role.name }}</option>
						</select>
					</div>
				</div>
				<div v-if="user.roleID > 0" class="col-md-6">
					<div class="form-floating mb-3 mb-md-0">
            <h5>Permissions</h5>
						<table class="table table-hover">
							<thead>
							</thead>
							<tbody ref="table">
								<tr v-for="permission in roles[user.roleID - 1].Permissions">
									<td>{{ permission.name }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</form>
		<div class="mt-4 mb-0">
			<div class="d-grid">
				<button v-if="newUser" @click="addUser" class="btn btn-primary">Add User</button>
			</div>
			<div class="d-grid">
				<button v-if="!newUser" @click="updateUser" class="btn btn-primary">Update User</button>
			</div>
			<div class="d-grid">
				<button v-if="!newUser" @click="deleteUser(user.id)" class="btn btn-danger">
					Delete User
				</button>
			</div>
		</div>
		<div id="err" class="small text-danger">{{ error }}</div>
		<div v-if="blogs.length > 0" class="d-grid mx-auto card mt-4">
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
						<tr v-for="blog in blogs">
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
	</div>
</template>
