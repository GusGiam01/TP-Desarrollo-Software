import { Entity, Property, ManyToOne, OneToOne, OneToMany, Collection, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Order } from '../Order/order.entity.js';

@Entity()
export class Shipping extends BaseEntity {

  @Property({ type: 'string', nullable: false })
  address!: string;

  @Property({ type: 'string', nullable: false })
  city!: string;

  @Property({ type: 'string', nullable: false })
  zipCode!: string;

  @Property({ type: 'string', nullable: false })
  cardNumber!: string;

  @Property({ type: 'string', nullable: false })
  expiryDate!: string;

  @Property({ type: 'string', nullable: false })
  cvv!: string;

  @Property({ type: 'string', nullable: false })
  cardholderName!: string;

  @OneToOne(() => Order, { nullable: false })
  order!: Ref<Order>;
}

