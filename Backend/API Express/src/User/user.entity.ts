import {
    Entity,
    Property,
    ManyToMany,
    Cascade,
    ManyToOne,
    Rel,
    Collection,
  } from '@mikro-orm/core'
  /*
  import {
    Entity,
    Property,
    ManyToMany,
    Cascade,
    ManyToOne,
    Rel,
    Collection,
  } from '@mikro-orm/mongodb'
  */
  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  
  @Entity()
  export class User extends BaseEntity {
    @Property({ type: 'string', nullable: false })
    name!: string

    @Property({ type: 'string', nullable: false })
    surname!: string
  
    @Property({ type: 'string', nullable: false })
    userName!: string
  
    @Property({ type: 'string', nullable: false })
    password!: string
  
    @Property({ type: 'string', nullable: false })
    type!: string
  
    @Property({ type: 'string', nullable: false })
    mail!: string

    @Property({ type: 'number', nullable: false })
    cellphone!: number

    @Property({ type: 'number', nullable: false })
    age!: number

  }