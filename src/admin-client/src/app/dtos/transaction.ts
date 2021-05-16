export interface Transaction {
    id: number;
    sourceId: string;
    targetId: string;
    date: Date;
    amount: number;
    sourceFullName: string;
    targetFullName: string;
}
