export interface Review {
    id: number;
    rating: number;
    content: string;
    updatedtime: Date;
    user: any;
    item: any;
}

export interface ReviewCreated {
    item_id: number;
    rating: number;
    content: string;
}