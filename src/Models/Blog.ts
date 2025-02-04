import type { User } from '@/Models/User'

export class Blog {
  constructor(
    public id: number,
    public title: string,
    public body: string,
    public summary: string,
    public image: string,
    public user: User,
  ) {}
}
