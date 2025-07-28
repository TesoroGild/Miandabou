export interface Order {
    clientId: string;
    total: string;
    timecreated: Date;
    expecteddateshipping: Date;
    orderCode: string;
}

export interface OrderToCreate {
    userEmail: string;
    total: number;//string?
}