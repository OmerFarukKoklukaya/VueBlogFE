<script lang="ts">
import Pagination from '@/components/Pagination.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import router from '@/routers'
import { useUserStore } from '@/stores/UserStore'

export default {
	name: 'AdminBlogsComponent',
	components: { Pagination },
	setup() {
		const paging = ref()
		const blogs = ref([])
		const isDataLoaded = ref(false)

		const getBlogs = async (page: '1') => {
			try {
				const { data } = await axios.get(`/blogs?page=${page}`)

				paging.value = data.meta.pagination
				blogs.value = data.data
				blogs.value.forEach((blog, index) => {
					if (!blog.user) {
						blogs.value[index].user = { name: 'deleted user' }
					}
				})
				isDataLoaded.value = true
				console.log(paging)

			} catch (e) {
				console.error('Error while loading blogs', e)
			}
		}

		onMounted(async()=>{getBlogs('1')})
		const deleteBlog = async (id: number) => {
			await axios.delete(`/blogs/${id.toString()}`)
			await getBlogs(paging.value.page.toString())
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
			deleteBlog,
			getBlogs,
			blogs,
			paging,
			isDataLoaded,

		}
	},
}
</script>

<template>
	<h1 class="mt-4">Blogs</h1>
	<div class="card-body">
		<table id="datatablesSimple" class="table table-hover">
			<thead class="">
				<tr>
					<th>Image</th>
					<th>Wrote Date</th>
					<th>Title</th>
					<th>Summary</th>
					<th>User</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th>Image</th>
					<th>Wrote Date</th>
					<th>Title</th>
					<th>Summary</th>
					<th>User</th>
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
					<td><router-link v-if="blog.user.id" :to="`/admin/users/${blog.user.id}`" class="btn link-info">{{blog.user.name}}</router-link><div v-else>{{blog.user.name}}</div></td>

					<td>
						<div class="btn-group">
							<router-link :to="'/blogs/' + blog.id.toString()" class="btn btn-primary"
								>Read</router-link
							>
							<button class="btn btn-danger" @click="deleteBlog(blog.id)">Delete</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<Pagination v-if="isDataLoaded" :last-page="paging.lastPage" @page-changed="getBlogs($event)" />
	</div>
</template>
