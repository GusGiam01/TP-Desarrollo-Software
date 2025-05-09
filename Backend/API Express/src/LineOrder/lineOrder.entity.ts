import { Entity, Property, ManyToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Product } from '../Product/product.entity.js';
import { Order } from '../Order/order.entity.js';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class LineOrder extends BaseEntity {
  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @Property({ type: 'number', nullable: false })
  quantity!: number;

  @ManyToOne(() => Order , {nullable: false })
  order!: Ref<Order>;

}
