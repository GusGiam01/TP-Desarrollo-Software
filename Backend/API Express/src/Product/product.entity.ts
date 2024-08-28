import {
    Entity,
    Property,
    ManyToMany,
    Cascade,
    ManyToOne,
    Rel,
    Collection,
  } from '@mikro-orm/core'
  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  
  @Entity()
  export class Product extends BaseEntity {
    @Property({ type: 'string', nullable: false })
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

  }