import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
  OneToMany,
} from '@mikro-orm/core'

import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Order } from '../Order/order.entity.js'
import { Address } from '../Address/address.entity.js'

@Entity()
export class User extends BaseEntity {
  @Property({ type: 'string', nullable: false })
  name!: string

  @Property({ type: 'string', nullable: false })
  surname!: string

  @Property({ type: 'string', nullable: false })
  password!: string

  @Property({ type: 'string', nullable: false })
  type!: string

  @Property({ type: 'string', nullable: false })
  mail!: string

  @Property({ type: 'string', nullable: false })
  cellphone!: string

  @Property({ type: 'number', nullable: true })
  age?: number | null

  @Property({ type: 'Date', nullable: false })
  birthDate!: Date

  @Property({ type: 'string', nullable: false })
  dni!: string

  @OneToMany(() => Order, order => order.user, { cascade: [Cascade.ALL] })
  orders = new Collection<Order>(this)

  @OneToMany(() => Address, address => address.user, { nullable: true, orphanRemoval:true, cascade: [Cascade.ALL]})
  addresses = new Collection<Address>(this)

}