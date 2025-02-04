<script lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { onMounted, ref } from 'vue'
import axios from 'axios'
export default {
  name: 'Menu',
	setup() {
		const loggedUser = useUserStore().user

		const logout = async () => {
			await axios.post("/logout")
		}

		const controlPermission = (permissionName: String):Boolean=>{
			let isHavePermission = false
			loggedUser.role.Permissions.forEach((permission) => {

				if(permission.name === permissionName){isHavePermission = true}
			})
			return isHavePermission
		}



		return {
			controlPermission,
			loggedUser,
			logout,
		}
	}
}
</script>

<template>
		<div id="layoutSidenav_nav">
			<nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
				<div class="sb-sidenav-menu">
					<div class="nav">
						<div class="sb-sidenav-menu-heading">Main Page</div>
						<a v-if="controlPermission('edit_blogs') ||controlPermission('edit_comments') " class="nav-link" href="/blogs">
							Blogs Page
						</a>
						<div class="sb-sidenav-menu-heading">Admin Blogs</div>
						<a v-if="controlPermission('edit_blogs')" class="nav-link" href="/admin/blogs">
							Blogs
						</a>
						<a v-if="controlPermission('edit_comments')" class="nav-link" href="/admin/comments">
							Comments
						</a>
						<div v-if="controlPermission('edit_users') || controlPermission('edit_roles') || controlPermission('edit_permissions')" class="sb-sidenav-menu-heading">Admin Users</div>
						<a v-if="controlPermission('edit_users')" class="nav-link" href="/admin/users">
							User
						</a>
						<a v-if="controlPermission('edit_roles')" class="nav-link" href="/admin/roles">
							Roles
						</a>
						<a v-if="controlPermission('edit_permissions')" class="nav-link" href="/admin/permissions">
							Permissions
						</a>

					</div>
				</div>
				<div class="sb-sidenav-footer">
					<div class="small">Logged in as:</div>
					{{loggedUser.name}}
				</div>
			</nav>
		</div>

</template>

