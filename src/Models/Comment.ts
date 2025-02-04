import type { User } from '@/Models/User'
import type { Blog } from '@/Models/Blog'

export class Comment{
	constructor(
		public id: number,
		public content: string,
		public blog_id: number,
		public blog: Blog,
		public parent_comment_id: number,
		public child_comments: Comment[],
		public isParent: boolean,
		public user: User,
		public user_id: number,
	) {}
}
