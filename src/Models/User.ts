import type { Blog } from '@/Models/Blog'
import type { Role } from '@/Models/Role'

export class User {
  constructor(
    public id: number,
    public name: string,
    public blogs: Blog[],
    public role: Role,
		public isHaveEditPermission: boolean,
  ) {}
}
