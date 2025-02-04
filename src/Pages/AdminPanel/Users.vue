<script lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import Pagination from '@/components/Pagination.vue'

export default {
	name: 'AdminUsersComponent',
	setup() {
		const paging = ref()
		const users = ref([])
		const isDataLoaded = ref(false)

		const getUsers = async (page: '1') => {
			try {
				const { data } = await axios.get(`/users?page=${page}`)

				paging.value = data.meta.pagination
				users.value = data.data
				isDataLoaded.value = true
			} catch (e) {
				console.error('Error while loading users', e)
			}
		}

		onMounted(async () => {
			getUsers('1')
		})
		const deleteUser = async (id: number) => {
			await axios.delete(`/users/${id.toString()}`)
			await getUsers(paging.value.page.toString())
		}
		const dateFormatter = (strDate: string) => {
			const parsedDate = Date.parse(strDate)
			const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'long' })
			const formattedDate = formatter.format(parsedDate)
			return formattedDate
		}

		return {
			axios,
			dateFormatter,
			deleteUser,
			getUsers,
			users,
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
	<h1 class="mt-4">Users</h1>
	<div class="card-body">
		<router-link :to="'/admin/users/new'" class="btn btn-primary">Add</router-link>
		<table id="datatablesSimple" class="table table-hover">
			<thead class="">
				<tr>
					<th>Joining Time</th>
					<th>Name</th>
					<th>Role</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th>Joining Time</th>
					<th>Name</th>
					<th>Role</th>
					<th>Actions</th>
				</tr>
			</tfoot>
			<tbody ref="table">
				<tr v-for="user in users">
					<td>{{ dateFormatter(user.CreatedAt) }}</td>
					<td>{{ user.name }}</td>
					<td><router-link :to="'admin/roles/'+user.roleID" class="btn link-info">{{ user.role.name }}</router-link></td>
					<td>
						<div class="btn-group">
							<router-link :to="'/admin/users/' + user.id.toString()" class="btn btn-dark"
								>Edit</router-link
							>
							<button class="btn btn-danger" @click="deleteUser(user.id)">Delete</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<Pagination v-if="isDataLoaded" :last-page="paging.lastPage" @page-changed="getUsers($event)" />
	</div>
</template>
