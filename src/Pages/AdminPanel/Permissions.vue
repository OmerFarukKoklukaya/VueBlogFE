<script lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

export default {
	name: 'AdminPermissionsComponent',
	setup() {
		const paging = ref()
		const permissions = ref([])
		const isDataLoaded = ref(false)

		const getPermissions = async (page: '1') => {
			try {
				const { data } = await axios.get(`/permissions?page=${page}`)

				paging.value = data.meta.pagination
				permissions.value = data.data

				isDataLoaded.value = true
				console.log(paging)

			} catch (e) {
				console.error('Error while loading permissions', e)
			}
		}

		onMounted(async()=>{await getPermissions('1')})
		const deletePermission = async (id: number) => {
			await axios.delete(`/permissions/${id.toString()}`)
			await getPermissions(paging.value.page.toString())
		}


		return {
			axios,
			deletePermission,
			getPermissions,
			permissions,
			paging,
			isDataLoaded,

		}
	},
}
</script>

<template>
	<h1 class="mt-4">Permissions</h1>
	<div class="card-body">
		<router-link :to="'/admin/permissions/new'" class="btn btn-primary">Add</router-link>
		<table id="datatablesSimple" class="table table-hover">
			<thead class="">
			<tr>
				<th>Name</th>
				<th>Actions</th>
			</tr>
			</thead>
			<tfoot>
			<tr>
				<th>Name</th>
				<th>Actions</th>
			</tr>
			</tfoot>
			<tbody ref="table">
			<tr v-for="permission in permissions">

				<td>{{ permission.name }}</td>

				<td>
					<div class="btn-group">
						<router-link :to="'/admin/permissions/' + permission.id.toString()" class="btn btn-dark">Edit</router-link>
						<button class="btn btn-danger" @click="deletePermission(permission.id)">Delete</button>
					</div>
				</td>
			</tr>
			</tbody>
		</table>
		<Pagination v-if="isDataLoaded" :last-page="paging.lastPage" @page-changed="getPermissions($event)" />
	</div>
</template>

