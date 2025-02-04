<script lang="ts">
import axios from 'axios'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import { routes } from 'vue-router/auto-routes'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import router from '@/routers'
import Comment from '@/components/Comments/CommentWrapper.vue'

export default {
	name: 'BlogPage',
	components: { Comment },
	setup() {
		const blog = reactive({
			id: '',
			title: '',
			body: '',
			summary: '',
			user: {},
			image: '',
		})
		const user = useUserStore().user
		const route = useRoute()
		const id = route.params.id
		const getData = async () => {
			try {
				const { data } = await axios.get(`/blogs/${id}`)
				blog.id = data.data.id.toString()
				blog.title = data.data.title
				blog.body = data.data.body
				blog.image = data.data.image
				blog.summary = data.data.summary
				blog.user = data.data.user
			} catch (e) {
				console.log(e)
			}
		}

		const deleteBlog = async ()=>{
			try{
				const {data} = await axios.delete(`/blogs/${id}`)
				router.push("/blogs")
			}catch (e) {
				console.log(e)
			}

		}

		onMounted(getData)
		return {
			blog,
			axios,
			user,
			deleteBlog,
		}
	},
}
</script>

<template>
	<div v-if="blog.image" class="d-grid">
		<img
			v-if="blog.image[0] === '/'"
			class="img-fluid img-thumbnail"
			:src="axios.defaults.baseURL + blog.image"
		/>
		<img v-else class="img-thumbnail" :src="blog.image" />
	</div>
	<h1>{{ blog.title }}</h1>
	<div v-html="blog.body"></div>
	<div class="d-grid" v-if="user.id != 0 && blog.user.id === user.id">
		<div class="btn-group-sm d-grid align-items-center">
			<router-link :to="`blogs/editor/${blog.id}`" class="btn btn-dark ">Edit</router-link>
			<button @click="deleteBlog" class="btn btn-danger ">Delete</button>
		</div>
	</div>
	<Comment :blog-id="blog.id"/>
</template>
