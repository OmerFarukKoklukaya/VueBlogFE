import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/Pages/Login.vue'
import Register from '@/Pages/Register.vue'
import BlogPage from '@/Pages/Blog/BlogPage.vue'
import BlogsPage from '@/Pages/Blog/BlogsPage.vue'
import Wrapper from '@/Pages/Wrapper.vue'
import CreateBlogPage from '@/Pages/Blog/BlogEditor.vue'
import Profile from '@/Pages/Profile.vue'
import Blogs from '@/Pages/AdminPanel/Blogs.vue'
import Comments from '@/Pages/AdminPanel/Comments.vue'
import Users from '@/Pages/AdminPanel/Users.vue'
import Roles from '@/Pages/AdminPanel/Roles.vue'
import Permissions from '@/Pages/AdminPanel/Permissions.vue'
import UserEdit from '@/Pages/AdminPanel/UserEdit.vue'
import RoleEdit from '@/Pages/AdminPanel/RoleEdit.vue'
import PermissionEdit from '@/Pages/AdminPanel/PermissionEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '',
      component: Wrapper,
      children:[
				{path: '', redirect: '/blogs'},
        {path: '/blogs', component: BlogsPage},
        {path: '/blogs/:id', component: BlogPage},
				{path: '/blogs/editor', component: CreateBlogPage},
				{path: '/blogs/editor/:id', component: CreateBlogPage},
				/************************************************************************************/
				{path:'/profile', component: Profile},
				/************************************************************************************/
				{path:'/admin/blogs',component: Blogs},
				{path:'/admin/comments', component: Comments},
				{path:'/admin/users', component: Users},
				{path:'/admin/users/new', component: UserEdit},
				{path:'/admin/users/:id', component: UserEdit},
				{path:'/admin/roles', component: Roles},
				{path:'/admin/roles/new', component: RoleEdit},
				{path:'/admin/roles/:id', component: RoleEdit},
				{path:'/admin/permissions', component: Permissions},
				{path:'/admin/permissions/new', component: PermissionEdit},
				{path:'/admin/permissions/:id', component: PermissionEdit},
      ],
    }
  ],
})

export default router
