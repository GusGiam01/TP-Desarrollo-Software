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
    @Property({ nullable: false })
    code!: string
  
    @Property({ nullable: false })
    priceUni!: number
  
    @Property({ nullable: false })
    name!: string
  
    @Property({ nullable: false })
    stock!: number
  
    @Property({ nullable: false })
    state!: string

    @Property({ nullable: false })
    discount!: number

    @Property({ nullable: false })
    type!: string

    @Property({ nullable: false })
    brand!: string

  }