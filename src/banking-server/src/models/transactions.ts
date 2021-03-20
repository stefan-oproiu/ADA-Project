export interface Transaction {
    id: number;
    sourceId: String;
    targetId: String;
    date: Date;
    amount: number;
    sourceFullName: string;
    targetFullName: string;
}