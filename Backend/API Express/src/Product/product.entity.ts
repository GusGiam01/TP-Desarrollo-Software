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
  } from '@mikro-orm/core'

  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { LineOrder } from '../LineOrder/lineOrder.entity.js'
  
  @Entity()
  export class Product extends BaseEntity {

    @Property({ type: 'string', nullable: false, unique: true })
    code!: string
  
    @Property({ type: 'string', nullable: false })
    priceUni!: number
  
    @Property({ type: 'string', nullable: false })
    name!: string
  
    @Property({ type: 'number', nullable: false })
    stock!: number
  
    @Property({ type: 'string', nullable: false })
    state!: string

    @Property({ type: 'number', nullable: false })
    discount!: number

    @Property({ type: 'string', nullable: false })
    type!: string

    @Property({ type: 'string', nullable: false })
    brand!: string

    @Property({ type: 'string', nullable: false })
    img!: string

    @OneToMany(() => LineOrder, lineOrder => lineOrder.product, {cascade: [Cascade.ALL]})
    linesOrder = new Collection<LineOrder>(this)
  }