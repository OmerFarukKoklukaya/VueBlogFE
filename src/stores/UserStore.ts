import { defineStore } from 'pinia'
import axios from 'axios'
import { User } from '@/Models/User'
import { ref } from 'vue'

export const useUserStore = defineStore('user', {
	state: () => ({ user: ref({} as User) }),
	actions: {
		async getUser() {
			try {
				const { data } = await axios.get('/profile', {
					withCredentials: true,
				})
				this.user = data
				this.user.isHaveEditPermission = false;
				this.user.role.Permissions.forEach((value) => {
					if (value.name.split('_')[0] === 'edit') {
						this.user.isHaveEditPermission = true
					}
				});
				console.log(this.user)
			} catch (err) {
				this.user.id = 0
			}
		},
	},
})
