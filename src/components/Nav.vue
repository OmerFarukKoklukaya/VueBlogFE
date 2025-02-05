<script lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import('https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js')
import('https://use.fontawesome.com/releases/v6.3.0/js/all.js')

export default {
	name: 'Nav',
	setup() {
		const loggedUser = useUserStore().user
		const isHaveWritePermission = ref(false)

    onMounted(()=>{
      if(!loggedUser.isHaveEditPermission || !loggedUser){
        document.body.classList.toggle('sb-sidenav-toggled');
      }
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.toggle('sb-sidenav-toggled');
      }
    })


		const toggleSidebar = () =>{

			document.body.classList.toggle('sb-sidenav-toggled');
			localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
		}

		const logout = async () => {
			await axios.post('/logout')
		}

		return {
			loggedUser,
			logout,
			isHaveWritePermission,
			toggleSidebar,
		}
	},
}
</script>

<template>
	<nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
		<!-- Navbar Brand-->
		<a class="navbar-brand ps-3" href="/blogs">Blog</a>
		<!-- Sidebar Toggle-->
		<button v-if="loggedUser.isHaveEditPermission"
			class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
			id="sidebarToggle"
			@click="toggleSidebar"
		>
			<i class="fas fa-bars"></i>
		</button>
		<!-- Navbar Search-->
		<form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
		<!-- Navbar-->
		<ul v-if="loggedUser.name" class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
			<li class="nav-item dropdown">
				<a
					class="nav-link dropdown-toggle"
					id="navbarDropdown"
					href="#"
					role="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					><i class="fas fa-user fa-fw"></i
				></a>
				<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">

					<li class="nav-item"><a class="dropdown-item" href="/blogs/editor">Write Blog</a></li>
					<li class="nav-item">
						<a class="dropdown-item" href="/profile">{{ loggedUser.name }}'s profile</a>
					</li>
					<li class="nav-item">
						<a class="dropdown-item" href="/blogs" @click="logout">Logout</a>
					</li>
				</ul>
			</li>
		</ul>
		<ul v-else class="navbar-nav ms-auto mb-2 mb-lg-0">
			<li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
			<li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
		</ul>
	</nav>
</template>


