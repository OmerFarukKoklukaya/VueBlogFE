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

		window.addEventListener('DOMContentLoaded', event => {

			// Toggle the side navigation
			const sidebarToggle = document.body.querySelector('#sidebarToggle');
			if (sidebarToggle) {
				// Uncomment Below to persist sidebar toggle between refreshes
				 if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
					 document.body.classList.toggle('sb-sidenav-toggled');
				 }
				sidebarToggle.addEventListener('click', event => {
					event.preventDefault();
					document.body.classList.toggle('sb-sidenav-toggled');
					localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
				});
			}

		});

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

		<div id="layoutSidenav">
			<Menu v-if="isStoreUpped && loggedUser.isHaveEditPermission" />

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
	</body>
</template>
