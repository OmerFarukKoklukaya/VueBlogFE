<script lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import axios from 'axios'
import router from '@/routers'
import { useRoute } from 'vue-router'
import ImageUpload from '@/components/ImageUpload.vue'

export default {
	name: 'CreateBlogPage',

	components: {
		ImageUpload,
		QuillEditor,
	},

	setup() {
		const route = useRoute()
		const qEditor = ref(null)
		const formData = reactive({
			id: '',
			title: '',
			body: '',
			summary: '',
			image: '',
		})
		const error = ref('')
		const isFormSubmitted = ref(false)

		onMounted(async () => {
			if (route.params.id) {
				try {
					const { data } = await axios.get(`/blogs/${route.params.id}`)
					formData.id = data.data.id.toString()
					formData.title = data.data.title
					formData.body = data.data.body
					qEditor.value.setHTML(data.data.body)
					formData.summary = data.data.summary
					formData.image = data.data.image
					console.log(formData)
				} catch (e) {
					error.value = String(e.message)
				}
			}
		})

		const onChange = () => {
			formData.body = qEditor.value.getHTML()
		}

		const setSumamary = () => {
			formData.summary = qEditor.value.getText()
			if (formData.summary.length > 60) {
				formData.summary = formData.summary.slice(0, 60) + '...'
			}
		}

		const submitPost = async () => {
			setSumamary()
			try {
				const {data} = await axios.post(
					'/blogs',
					{
						title: formData.title,
						body: formData.body,
						summary: formData.summary,
					},
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						withCredentials: true,
					},
				)
				formData.id = data.data.id
				isFormSubmitted.value = true

				await router.push(`/blogs/${formData.id}`)
			} catch (e) {
				if (e.response && e.response.status === 400) {
					console.log(e.response.data)
					error.value = e.response.data
				}
			}
		}

		const submitPut = async () => {
			setSumamary()
			try {
				const {data} = await axios.put(
					`/blogs/${route.params.id}`,
					{
						title: formData.title,
						body: formData.body,
						summary: formData.summary,
					},
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						withCredentials: true,
					},
				)
				formData.id = data.data.id
				isFormSubmitted.value = true

				await router.push(`/blogs/${formData.id}`)
			} catch (e) {
				if (e.response && e.response.status === 400) {
					console.log(e.response.data)
					error.value = e.response.data
				}
			}
		}

		return {
			formData,
			onChange,
			qEditor,
			error,
			submitPost,
			submitPut,
			route,
			isFormSubmitted,
		}
	},
}
</script>

<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-18">
				<div class="card shadow-lg border-0 rounded-lg mt-5">
					<div class="card-body">
						<form>
							<div class="form-floating mb-3">
								<input
									v-model="formData.title"
									class="form-control"
									id="name"
									name="name"
									type="text"
									placeholder="Name"
								/>
								<label for="name">Title</label>
							</div>
							<div class="form-floating mb-3">
								<QuillEditor ref="qEditor" @textChange="onChange" placeholder="Body" theme="snow" />
							</div>
							<div class="form-floating mb-3">
								<div class="img-fluid card-img-bottom mb-3">
									<ImageUpload :id="formData.id" :img-push="isFormSubmitted" :img-adress="formData.image"/>
								</div>
							</div>
						</form>
						<div v-if="route.params.id" class="mt-4 mb-0">
							<div class="d-grid">
								<button @click="submitPut" class="btn btn-primary">Update</button>
							</div>
						</div>
						<div v-else class="mt-4 mb-0">
							<div class="d-grid">
								<button @click="submitPost" class="btn btn-primary">Send</button>
							</div>
						</div>
						<div class="small text-danger">{{ error }}</div>
					</div>
					<div class="card-footer text-center py-3"></div>
				</div>
			</div>
		</div>
	</div>
</template>
