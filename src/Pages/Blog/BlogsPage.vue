<script lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/UserStore'
import router from '@/routers'
import Pagination from '@/components/Pagination.vue'

export default {
	name: 'BlogsPage',
	components: { Pagination },
	computed: {
		axios() {
			return axios
		},
	},

	setup() {
		const store = useUserStore()
		const loggedUser = ref()
		const paging = ref()
		const isDataLoaded = ref(false)

		const readUser = async () => {
			loggedUser.value = await store.user
		}

		const blogs = ref([])
		const loadData = async (page = 1) => {
			try {
				const { data } = await axios.get(`blogs?page=${page}`)
				paging.value = data.meta.pagination
				blogs.value = data.data
				isDataLoaded.value = true
				window.scroll(1,1)
			} catch (err) {}
		}

		const dateFormatter = (strDate: string) => {
			const parsedDate = Date.parse(strDate)
			const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'long' })
			const formattedDate = formatter.format(parsedDate)
			return formattedDate
		}

		onMounted(async ()=>{
			readUser()
			loadData()
		})
		return {
			blogs,
			isDataLoaded,
			dateFormatter,
			loggedUser,
			loadData,
			paging,
		}
	},
}
</script>

<template>
	<div>
	<div v-for="blog in blogs">
		<!-- Blog post-->
		<div class="card mb-4">
			<div v-if="blog.image">
				<img
					v-if="blog.image[0] === '/'"
					class="card-img-top"
					:src="axios.defaults.baseURL + blog.image"
				/>
				<img v-else class="card-img-top" :src="blog.image" />
			</div>
			<div class="card-body">
				<h2 class="card-title h4">{{ blog.title }}</h2>
				<div class="small text-muted">
					Created at {{ dateFormatter(blog.CreatedAt) }} by <span v-if="blog.user">{{ blog.user.name }}</span> <span v-else>deleted user</span>
				</div>
				<p class="card-text">{{ blog.summary }}</p>
				<router-link class="btn btn-primary" :to="`blogs/${blog.id}`">Read more →</router-link>
			</div>
			<div class="card-footer" v-if="blog.user && blog.user.id === loggedUser.id">
				<div  class="btn-group-sm d-grid align-items-center">
					<router-link :to="`blogs/editor/${blog.id}`" class="btn btn-dark">Edit</router-link>
				</div>
			</div>
		</div>
	</div>
	<Pagination v-if="isDataLoaded" :last-page="paging.lastPage"  @page-changed="loadData($event)" />
	</div>
</template>
