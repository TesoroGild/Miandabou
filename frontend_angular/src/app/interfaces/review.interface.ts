export interface Review {
    id: number;
    rating: number;
    content: string;
    updatedtime: Date;
    user: string;
    //userId: number;
    item: string;
    itemId: number;
}

export interface ReviewCreated {
    item_id: number;
    rating: number;
    content: string;
}