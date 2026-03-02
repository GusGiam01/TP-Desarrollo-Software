import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
  PrimaryKey,
  SerializedPrimaryKey,
  OneToMany,
  Unique,
  Ref,
} from '@mikro-orm/core'

import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from '../User/user.entity.js'
import { Order } from '../Order/order.entity.js'

@Entity()
export class Address extends BaseEntity {

  @Property({ type: 'string', nullable: false })
  zipCode!: string

  @Property({ type: 'string', nullable: false })
  address!: string

  @Property({ type: 'string', nullable: false })
  province!: string

  @Property({ type: 'string', nullable: false })
  nickname!: string

  @ManyToOne(() => User, { nullable: false })
  user!: Ref<User>

  @OneToMany(() => Order, order => order.address, { nullable: true })
  orders?: Array<Order>
}