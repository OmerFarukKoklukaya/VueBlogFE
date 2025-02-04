<script lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import Pagination from '@/components/Pagination.vue'
import { mapState } from 'pinia'

export default {
	name: 'AdminCommentsComponent',
	methods: { mapState },
	setup: function () {
		const paging = ref()
		const comments = ref([])
		const isDataLoaded = ref(false)

		const getComments = async (page: '1') => {
			try {
				const { data } = await axios.get(`/comments?page=${page}`)

				paging.value = data.meta.pagination
				comments.value = data.data
				comments.value.forEach((comment, index) => {
					if (!comment.user) {
						comments.value[index].user = { name: 'deleted user' }
					}
				})
				console.log(comments)
				console.log(paging)
				isDataLoaded.value = true
			} catch (e) {
				console.error('Error while loading comments', e)
			}
		}

		onMounted(async () => {
			await getComments('1')
		})

		const deleteComment = async (id: number) => {
			await axios.delete(`/comments/${id.toString()}`)
			await getComments(paging.value.page.toString())
		}
		const dateFormatter = (strDate: string) => {
			const parsedDate = Date.parse(strDate)
			const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'short' })
			const formattedDate = formatter.format(parsedDate)
			return formattedDate
		}

		return {
			axios,
			dateFormatter,
			deleteComment,
			getComments,
			comments,
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
	<h1 class="mt-4">Comments</h1>
	<div v-if="isDataLoaded" class="card-body">
		<table id="datatablesSimple" class="table table-hover">
			<thead class="">
				<tr>
					<th>Blog</th>
					<th>Wrote Date</th>
					<th>Comment Content</th>
					<th>User</th>
					<th>Parent Comment</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th>Blog</th>
					<th>Wrote Date</th>
					<th>Comment Content</th>
					<th>User</th>
					<th>Parent Comment</th>
					<th>Actions</th>
				</tr>
			</tfoot>
			<tbody ref="table">
				<tr v-for="comment in comments">
					<td v-if="comment.blog">
						<router-link :to="`/blogs/${comment.blog.id}`" class="btn link-info">
							<div>{{ comment.blog.title }}</div>
						</router-link>
					</td>
					<td v-else class="text-muted">This blog deleted</td>
					<td>{{ dateFormatter(comment.CreatedAt) }}</td>
					<td>{{ comment.content }}</td>
					<td>
						<router-link
							v-if="comment.user.id"
							:to="`/admin/users/${comment.user.id}`"
							class="btn link-info"
							>{{ comment.user.name }}</router-link
						>
						<div v-else>{{ comment.user.name }}</div>
					</td>

					<td v-if="comment.parent_comment">{{ comment.parent_comment.content }}</td>
					<td v-else class="text-muted">This comment not have a parent</td>

					<td>
						<div class="btn-group">
							<router-link :to="'/comments/editor/' + comment.id.toString()" class="btn btn-dark"
								>Edit</router-link
							>
							<button class="btn btn-danger" @click="deleteComment(comment.id)">Delete</button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<Pagination v-if="isDataLoaded" :last-page="paging.lastPage" @page-changed="getComments($event)" />
	</div>
</template>
