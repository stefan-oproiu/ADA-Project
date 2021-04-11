export interface Transaction {
    id: number;
    sourceId: string;
    targetID: string;
    date: Date;
    amount: number;
    sourceFullName: string;
    targetFullName: string;
}
