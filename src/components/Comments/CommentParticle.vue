<script lang="ts">
import { Comment } from '@/Models/Comment'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/UserStore'

export default {
	name: 'CommentParticle',
	props: {
		comment: {},
	},
	setup(props) {
		const dateFormatter = (strDate: string) => {
			const parsedDate = Date.parse(strDate)
			const formatter = new Intl.DateTimeFormat('default', { dateStyle: 'long' })
			const formattedDate = formatter.format(parsedDate)
			return formattedDate
		}
		const loggedUser = useUserStore().user
		const comment = ref()
		const openCommentSection = ref(false)
		const newComment = ref()

		const handleClickOutside = (event) => {
			const modalContainer = document.querySelector('.modal-locked');

			if (modalContainer && !modalContainer.contains(event.target.parentNode)) {
				openCommentSection.value = false
			}
		};





		onMounted(() => {
			document.addEventListener('click', handleClickOutside);
			comment.value = props.comment
		})

		watch(props, () => {
			comment.value = props.comment
		})

		const sendComment = async () => {
			try {
				const { data } = await axios.post(
					'/comments',
					{
						blog_id: comment.value.blogID,
						content: newComment.value,
						parent_comment_id: comment.value.id.toString(),
					},
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						withCredentials: true,
					},
				)
        if (!comment.value.child_comments) {
          comment.value.child_comments = []
        }
				comment.value.child_comments.unshift(data.data)
        newComment.value = ''
        openCommentSection.value = false
			} catch (e) {
				console.log(e)
			}
		}

		const getComment = async (id: string) => {
			const { data } = await axios.get('comments/' + id)
			console.log('get data', data.data)
			try {
				comment.value.child_comments = data.data.child_comments
				console.log('Comment changed:', comment)
			} catch (e) {
				console.log('Comment changed error: ', e)
			}
		}

		return {
			comment,
			dateFormatter,
			getComment,
			openCommentSection,
			loggedUser,
			newComment,
			sendComment,
		}
	},
}
</script>

<template>
	<!-- Parent comment-->
	<div class="ms-5" v-if="comment">
		<div class="fw-bold">
			<span v-if="comment.user">{{ comment.user.name }}</span> <span v-else>deleted user</span>

			<q class="disabled fw-light">posted at {{ dateFormatter(comment.CreatedAt) }}</q>
		</div>
		{{ comment.content }}
		<div v-if="!openCommentSection && loggedUser.name">

			<button @click="openCommentSection = true" class="btn ms-3 text-info">-reply-</button>
		</div>
		<div v-if="openCommentSection" class="mb-4 list-group">
			<textarea
				v-model="newComment"
				class="form-control"
				rows="3"
				placeholder="Join the discussion and leave a comment!"
			></textarea>
			<button v-if="newComment" @click="sendComment" class="btn btn-info">Send</button>
		</div>
		<div v-if="comment.is_parent && !comment.child_comments">
			<button @click="getComment(comment.id.toString())" class="btn ms-3 link-info">
				-see more comment-
			</button>
		</div>
		<hr />
		<!-- Child comment 1-->
		<div v-if="comment.child_comments">
			<div v-for="child_comment of comment.child_comments">
				<CommentParticle :comment="child_comment" />
			</div>
		</div>
	</div>
</template>
