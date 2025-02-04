<script lang="ts">
import axios from 'axios'
import { inject, pushScopeId, ref, type SetupContext, defineProps, watch, onMounted } from 'vue'

export default {
	name: 'ImageUpload',
	props: {
		id: String,
		imgPush: Boolean,
		imgAdress: String,
	},
	setup(props) {
		watch(props, pushImg)
		const formData = new FormData()
		const dosya = ref('')
		const error = ref('')

		const getUppedImg = async () => {
			if(props.imgAdress){
				if(props.imgAdress[1] === '/'){
					dosya.value = props.imgAdress
				}else{
					dosya.value = axios.defaults.baseURL+props.imgAdress
				}
			}

		}

		const upload = (files: FileList | null) => {
			if (files === null) {
				return
			}
			const fil = files.item(0)
			dosya.value = URL.createObjectURL(fil)
			formData.append('image', fil)
		}

		const deleteImg = async () => {
			try {
				formData.delete('image')
				dosya.value = ''
				axios.delete(`/blogs/${props.id}/image`)
			} catch (e) {
				error.value = e.response.data.message
				getUppedImg()
			}
		}

		function pushImg() {
			if (!props.imgPush && props.id) {
				getUppedImg()
			} else if (props.imgPush && props.id) {
				axios.post(`blogs/${props.id}/image`, formData, {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					withCredentials: true,
				})
			}
		}

		return {
			props,
			dosya,
			upload,
			deleteImg,
			error,
		}
	},
}
</script>

<template>
	<label class="btn btn-primary">
		<div v-if="dosya">
			<h3>Change Image</h3>
			<img class="img-fluid" v-bind:src="dosya" />
		</div>

		<div v-if="!dosya">Upload Image</div>
		<input type="file" hidden @change="upload($event.target.files)" />
		<div class="small text-danger">{{ error }}</div>
	</label>
	<div v-if="dosya" @click="deleteImg" class="btn btn-danger d-grid">Delete Image</div>
</template>
