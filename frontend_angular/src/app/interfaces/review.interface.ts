export interface Review {
    id: number;
    rating: number;
    content: string;
    updatedtime: Date;
    user: string;
    item: string;
}

export interface ReviewCreated {
    item_id: number;
    rating: number;
    content: string;
}