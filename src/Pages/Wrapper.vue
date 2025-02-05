<script lang="ts">
import Menu from '@/components/Menu.vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import Nav from '@/components/Nav.vue'
export default {
	name: 'Wrapper',
	setup() {
		const store = useUserStore()
		const loggedUser = ref()
		const isStoreUpped = ref(false)
		const getStore = async () => {
			await store.getUser()
		}




		onMounted(async () => {
			try {
				await getStore()
			} catch {}
			isStoreUpped.value = true
			loggedUser.value = useUserStore().user
		})
		return {
			isStoreUpped,
			loggedUser,
		}
	},
	components: {
		Nav,
		Menu,
	},
}
</script>

<template>
	<body class="sb-nav-fixed">
		<Nav v-if="isStoreUpped" />

		<div v-if="isStoreUpped && loggedUser.isHaveEditPermission" id="layoutSidenav">
			<Menu  />

			<div id="layoutSidenav_content">
				<div class="container">
					<div class="row">
						<main class="col-lg-12">
							<router-view v-if="isStoreUpped" />
						</main>
					</div>
				</div>
			</div>
		</div>

    <div v-else class="container">
      <div class="row">
        <main class="col-lg-12">
          <router-view v-if="isStoreUpped" />
        </main>
      </div>
    </div>
	</body>
</template>
