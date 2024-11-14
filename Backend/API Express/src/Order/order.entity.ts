import { Entity, Property, ManyToOne, OneToMany, Collection, Cascade, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { User } from '../User/user.entity.js';
import { LineOrder } from '../LineOrder/lineOrder.entity.js';

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

  // Correspondiente a direccion. Eliminar cuando se cree la respectiva clase.

  @Property({ type: 'string', nullable: true })
  address?: string

  @Property({ type: 'number', nullable: true })
  zipCode?: number

  @Property({ type: 'string', nullable: true })
  province?: string
}
