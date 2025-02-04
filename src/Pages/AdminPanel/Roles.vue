<script lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Pagination from '@/components/Pagination.vue'

export default {
	name: 'AdminRolesComponent',
	setup() {
		const paging = ref()
		const roles = ref([])
		const isDataLoaded = ref(false)

		const getRoles = async (page: '1') => {
			try {
				const { data } = await axios.get(`/roles?page=${page}`)

				paging.value = data.meta.pagination
				roles.value = data.data

				isDataLoaded.value = true
				console.log(roles)
			} catch (e) {
				console.error('Error while loading roles', e)
			}
		}

		onMounted(async () => {
			await getRoles('1')
		})

		const deleteRole = async (id: number) => {
			await axios.delete(`/roles/${id.toString()}`)
			await getRoles(paging.value.page.toString())
		}

		return {
			axios,
			deleteRole,
			getRoles,
			roles,
			paging,
			isDataLoaded,
		}
	},
	components: {
		Pagination,
	},
}
</script>

<template>
	<h1 class="mt-4">Roles</h1>
	<div class="card-body">
		<router-link :to="'/admin/roles/new'" class="btn btn-primary">Add</router-link>
		<table id="datatablesSimple" class="table table-hover">
			<thead class="">
				<tr>
					<th>Name</th>
					<th>Permissions</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th>Name</th>
					<th>Permissions</th>
					<th>Actions</th>
				</tr>
			</tfoot>
			<tbody ref="table">
				<tr v-for="role in roles">
					<td>{{ role.name }}</td>
					<td>
						<table class="table table-sm">
							<tr v-for="permission in role.Permissions">
								<td><router-link :to="'/admin/permissions/'+permission.id.toString()" class="btn link-info">{{ permission.name }}</router-link></td>
							</tr>
						</table>
					</td>

					<td>
						<div class="btn-group" v-if="role.id">
							<router-link :to="'/admin/roles/' + role.id.toString()" class="btn btn-dark"
								>Edit</router-link>
							<button class="btn btn-danger" @click="deleteRole(role.id)">Delete</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<Pagination v-if="isDataLoaded" :last-page="paging.lastPage" @page-changed="getRoles($event)" />
	</div>
</template>
