export interface order{
    id?: number,
    user_id: number,
    total: number,
    shipping?: string,
    payment?: string,
    comment?:string,
    status: boolean,
    created_at?: Date,
    updated_at?:Date,
}