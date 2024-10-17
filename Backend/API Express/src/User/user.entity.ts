import {
    Entity,
    Property,
    ManyToMany,
    Cascade,
    ManyToOne,
    Rel,
    Collection,
    PrimaryKey,
  } from '@mikro-orm/core'
  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  
  @Entity()
  export class User extends BaseEntity {
    @Property({ type: 'string', nullable: false })
    name!: string

    @Property({ type: 'string', nullable: false })
    surname!: string
  
    @Property({ type: 'string', nullable: false })//comnbinaria con el dni
    userName!: string
  
    @Property({ type: 'string', nullable: false })
    password!: string
  
    @Property({ type: 'string', nullable: false })
    type!: string
  
    @Property({ type: 'string', nullable: false })
    mail!: string

    @Property({ type: 'string', nullable: false })
    cellphone!: string

    @Property({ type: 'number', nullable: true }) //podriamos sacar
    age?: number | null

    @Property({ type: 'Date', nullable: false })
    birthDate!: Date

    @Property({ type: 'string', nullable: false, unique: true })
    dni!: string


    //@PrimaryKey({ type: 'string', nullable: false, unique:true})
    //dni!:string
  }