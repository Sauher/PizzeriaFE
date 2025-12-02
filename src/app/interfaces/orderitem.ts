export interface OrderItem{
    id?: number,
    order_id: number,
    pizza_id: number,
    quantity: number,
    price: number,
    created_at?: Date,

}