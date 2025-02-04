<script lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/routers'
import axios from 'axios'

export default {
	name: 'AdminRoleComponent',
	setup() {
		const role = reactive({
			id: 0,
			name: '',
			permissions: [],
		})
		const permissions = ref([])
		const newRole = ref(false)
		const route = useRoute()

		onMounted(async () => {
			const { data } = await axios.get('/permissions')
			permissions.value = data.data

			if (!route.params.id) {
				newRole.value = true
			} else if (parseInt(route.params.id.toString()) > 0) {
				const { data } = await axios.get('/roles/' + route.params.id)
				role.id = data.data.id
				role.name = data.data.name
				data.data.Permissions.forEach((permission) => {
					role.permissions.push(permission.id)
				})

				console.log(role)
			} else {
				router.push('/admin/roles')
			}
		})

		const addRole = async () => {
			await axios.post(
				'/roles',
				JSON.stringify({
					name: role.name,
					permissions: role.permissions,
				}),
				{
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' },
				},
			)
			await router.push('/admin/roles')
		}
		const updateRole = async () => {
			await axios.put(
				'/roles/' + role.id.toString(),
				JSON.stringify({
					name: role.name,
					permissions: role.permissions,
				}),
				{
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' },
				},
			)
			await router.push('/admin/roles/' + role.id)
		}
		const deleteRole = async () => {
			try {
				await axios.delete('/roles/' + role.id)
				await router.push('/admin/roles')
			} catch (err) {
				console.log(err)
			}
		}

		return {
			role,
			permissions,
			newRole,
			addRole,
			updateRole,
			deleteRole,
		}
	},
}
</script>

<template>
	<h1>Role</h1>
	<div class="card-body">
		<form id="register-form">
			<div class="form-floating mb-3">
				<input
					v-model="role.name"
					class="form-control"
					id="name"
					name="name"
					type="name"
					placeholder="User Name"
				/>
				<label for="name">Name</label>
			</div>
			<h5>Permissions</h5>
			<div v-for="permission in permissions" class="form-check mb-3">
				<input
					class="form-check-input"
					:id="permission.id"
					type="checkbox"
					v-model="role.permissions"
					:value="permission.id"
				/>
				<label class="form-check-label" :for="permission.id">{{ permission.name }}</label>
			</div>
		</form>
		<div class="mt-4 mb-0">
			<div class="d-grid">
				<button v-if="newRole" @click="addRole" class="btn btn-primary">Add Role</button>
			</div>
			<div class="d-grid">
				<button v-if="!newRole" @click="updateRole" class="btn btn-primary">Update Role</button>
			</div>
			<div class="d-grid">
				<button v-if="!newRole" @click="deleteRole(role.id.toString())" class="btn btn-danger">
					Delete Role
				</button>
			</div>
		</div>
	</div>
</template>
