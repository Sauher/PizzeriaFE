export interface User{
    id?: number,
    name: string,
    email: string,
    password: string,
    confirm: string,
    phone?: string,
    address?: string,
    reg?: string,
    lastLog?: string,
    status?: boolean,
    role: string,
}