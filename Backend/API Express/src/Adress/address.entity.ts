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
  } from '@mikro-orm/core'

  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  
  @Entity()
  export class Adress extends BaseEntity {

    @Property({ type: 'string', nullable: false})
    zipCode!: string
  
    @Property({ type: 'string', nullable: false })
    address!: string
  
    @Property({ type: 'string', nullable: false })
    province!: string

    @Property({ type: 'string', nullable: false })
    nickname!: string
  }