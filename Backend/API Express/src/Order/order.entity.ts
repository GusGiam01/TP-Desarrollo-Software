import { Entity, Property, ManyToOne, OneToMany, Collection, Cascade, Ref, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { User } from '../User/user.entity.js';
import { LineOrder } from '../LineOrder/lineOrder.entity.js';
import { Adress } from '../Adress/address.entity.js'


@Entity()
export class Order extends BaseEntity {
  @Property({ type: 'Date', nullable: true })
  confirmDate?: Date;

  @ManyToOne(() => User, { nullable: false })
  user!: Ref<User>;

  @OneToMany(() => LineOrder, (lineaOrder) => lineaOrder.order, { cascade: [Cascade.PERSIST, Cascade.REMOVE], nullable: false })
  linesOrder = new Collection<LineOrder>(this);

  @Property({ type: 'number', nullable: false })
  totalAmount!: number;

  @Property({ type: 'json', nullable: true })
  statusHistory: string[] = [];

  @Property({ type: 'string', nullable: true })
  address?: Adress;
}
