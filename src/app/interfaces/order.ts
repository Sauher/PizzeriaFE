export interface order{
    id: number,
    user_id: number,
    total: number,
    status: boolean,
    created_at?: Date,
    updated_at?:Date,
}