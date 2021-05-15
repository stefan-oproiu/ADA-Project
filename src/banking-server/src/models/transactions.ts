export interface Transaction {
    id: String;
    sourceId: String;
    targetId: String;
    date: Date;
    amount: number;
    sourceFullName: string;
    targetFullName: string;
}
