export interface Message{
    severity: 'info' | 'danger' | 'warning' | 'success';
    title: string,
    message?: string,
    icon?: string
}