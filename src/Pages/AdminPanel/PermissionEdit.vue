<script lang="ts">
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import router from '@/routers'

export default {
	name: 'AdminPermissionComponent',
	setup() {
		const permission = reactive({
			id: '',
			name: '',
		})
		const route = useRoute()
		const newPermission = ref(false)

		onMounted(async () => {
			if (!route.params.id) {
				newPermission.value = true
			} else if (parseInt(route.params.id.toString()) > 0) {
				const { data } = await axios.get('/permissions/' + route.params.id.toString())
				permission.id = data.data.id
				permission.name = data.data.name
			} else {
				await router.push('/admin/permissions')
			}
		})

		const addPermission = async () => {
			console.log("hi")
			const {data}=await axios.post(
				'/permissions',
				JSON.stringify({
					name: permission.name,
				}),
				{
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' },
				},
			)
			console.log(data)
			await router.push('/admin/permissions')
		}
		const updatePermission = async () => {
			await axios.put(
				'/permissions/' + permission.id.toString(),
				JSON.stringify({
					name: permission.name,
				}),
				{
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' },
				},
			)
			await router.push('/admin/permissions/')
		}
		const deletePermission = async () => {
			await axios.delete('/permissions/' + permission.id.toString())
			await router.push('/admin/permissions')
		}

		return {
			permission,
			newPermission,
			addPermission,
			updatePermission,
			deletePermission,
		}
	},
}
</script>

<template>
	<h1>Permission</h1>
	<div class="card-body">
		<form id="register-form">
			<div class="form-floating mb-3">
				<input
					v-model="permission.name"
					class="form-control"
					id="name"
					name="name"
					type="name"
					placeholder="User Name"
				/>
				<label for="name">Permission</label>
			</div>
		</form>

		<div class="mt-4 mb-0">
			<div class="d-grid">
				<button v-if="newPermission" @click="addPermission" class="btn btn-primary">Add Permission</button>
			</div>
			<div class="d-grid">
				<button v-if="!newPermission" @click="updatePermission" class="btn btn-primary">Update Permission</button>
			</div>
			<div class="d-grid">
				<button v-if="!newPermission" @click="deletePermission" class="btn btn-danger">
					Delete Permission
				</button>
			</div>
		</div>

	</div>
</template>
