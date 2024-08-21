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
  export class User extends BaseEntity {
    @Property({ nullable: false })
    name!: string

    @Property({ nullable: false })
    surname!: string
  
    @Property({ nullable: false })
    user!: string
  
    @Property({ nullable: false })
    password!: string
  
    @Property({ nullable: false })
    type!: string
  
    @Property({ nullable: false })
    mail!: string

    @Property({ nullable: false })
    cellphone!: number

    @Property({ nullable: false })
    age!: number

  }