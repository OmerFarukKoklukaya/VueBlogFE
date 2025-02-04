import type { Permission } from '@/Models/Permission'

export class Role {
  constructor(
    public id: number,
    public name: string,
    public permissions: Permission[],
  ) {}
}
