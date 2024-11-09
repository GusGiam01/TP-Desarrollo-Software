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
  export class Cart extends BaseEntity {
    @Property({ type: 'string', nullable: false })
    userId!: string;

    @Property({ type: 'array', nullable: false })
    products!: Array<{
      code: string;
      priceUni: string; 
      name: string;
      stock: number; 
      type: string;
      state: number; 
      discount: string; 
      brand: string;
    }>;

    @Property({ type: 'date', nullable: false })
    date!: Date;

    @Property({ type: 'string', nullable: false })
    status!: string;

    @Property({ type: 'number', nullable: false })
    totalPrice!: number;


  }