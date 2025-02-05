<script lang="ts">
import { mergeProps, onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'
import CommentParticle from '@/components/Comments/CommentParticle.vue'
import { Comment } from '@/Models/Comment'
import { Blog } from '@/Models/Blog'
import { useUserStore } from '@/stores/UserStore'
import { mergeAlias } from 'vite'
import { blob } from 'node:stream/consumers'

export default {
	name: 'CommentComponent',
	computed: {
		Blog() {
			return Blog
		},
		Comment() {
			return Comment
		},
	},
	components: { CommentParticle },
	props: {
		getBy: String,
		blogId: String,
	},
	setup(props) {
		const comments = ref([])
		const pagination = ref()
		const newComment = ref()
		const loggedUser = useUserStore().user

		const getComments = async (id: '1') => {
			const { data } = await axios.get(`/blogs/${props.blogId}/comments?page=${id}`)
			data.data.forEach(incomingComment => {
				comments.value.push(incomingComment)
			})

			pagination.value = data.meta.pagination

		}

		const sendComment = async () => {
			try {
				const { data } = await axios.post(
					'/comments',
					{
						blog_id: props.blogId,
						content: newComment.value,
						parent_comment: null,
					},
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						withCredentials: true,
					},
				)

				comments.value.unshift(data.data)
        if(comments.value.length > 5){}
				comments.value.pop()

				newComment.value = ("")

			} catch (e) {
				console.log(e)
			}
		}

		watch(props, getComments)

		onMounted(() => {})

		return {
			comments,
			pagination,
			getComments,
			newComment,
			loggedUser,
			sendComment,
		}
	},
}
</script>

<template>
	<section class="mb-5">
		<div class="card bg-light">
			<div class="card-body">

				<!-- Comment form-->
					<div class="mb-4 list-group">
						<textarea
							v-if="loggedUser.name"
							v-model="newComment"
							class="form-control"
							rows="3"
							placeholder="Join the discussion and leave a comment!"
						></textarea>
						<textarea
							v-else
							class="form-control"
							rows="3"
							placeholder="Login for write comment."
							disabled="true"
						></textarea>

						<button v-if="newComment" @click="sendComment" class="btn btn-info">Send</button>
					</div>

				<!-- Comment with nested comments-->
				<div v-for="comment in comments" class="d-flex mb-4">
					<!-- Parent comment-->
					<CommentParticle  :comment="comment" />
				</div>

				<div>
					<button
						v-if="pagination && pagination.page !== pagination.lastPage"
						@click="getComments((pagination.page + 1).toString())"
						class="btn ms-3 link-info"
					>
						-see more comment-
					</button>
				</div>

			</div>
		</div>
	</section>
</template>
