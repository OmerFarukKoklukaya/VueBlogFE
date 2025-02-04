<script lang="ts">
import { ref, type SetupContext, watch } from 'vue'
export default {
	Name:"Paginate",
	emits:['page-changed'],
	props:{
			page: Number,
			lastPage: Number,
	},
	setup(props, context: SetupContext) {
		const page = ref(1)
		const next = async () => {
			if (page.value < props.lastPage) {
				page.value++
			}
		}
		const prev = async () => {
			if (page.value > 1) {
				page.value--
			}
		}

		const gotoPage = (newPage = 1) => {
			page.value = newPage
		}

		watch(page, ()=>{
			context.emit('page-changed',page.value)
		})

		return{
			prev,
			next,
			gotoPage,
			page,
			props,
		}
	},
}


</script>

<template>
	<nav class="btn-group">
		<ul class="pagination">

			<li class="page-item">
				<button v-if="page > 2" class="page-link" @click="gotoPage(1)"><< </button>
			</li>
			<li class="page-item">
				<button v-if="page-1 === 1" class="page-link" @click="gotoPage(1)">1</button>
			</li>
			<li class="page-item">
				<button v-if="page -1 > 1" class="page-link" @click="gotoPage(page-1)">{{page-1}}</button>
			</li>

			<li class="page-item">
				<button class="btn ">{{page}}</button>
			</li>

			<li v-for="i in [1,2,3]" class="page-item">
				<button v-if="page+i < props.lastPage" class="page-link" @click="gotoPage(page+i)">{{page+i}}</button>
			</li>

			<li class="page-item">
				<button v-if="page+1 === props.lastPage" class="page-link" @click="gotoPage(props.lastPage)">{{props.lastPage}}</button>
			</li>

			<li class="page-item">
				<button v-if="page+1 < props.lastPage" class="page-link" @click="gotoPage(props.lastPage)">>></button>
			</li>

		</ul>
	</nav>
</template>
