export interface User {
    id?: string;
    username?: string;
    password: string;
    lastname: string;
    role: string;
    firstname: string;
    dateOfBirth?: string;
    department?: string;
    picture?: string;
    tel?: string;
    email: string;
    status: string;
    //deliveryAddress: string;
}

export interface UserToDisplay {
    id?: string;
    email: string; 
    lastname: string;
    firstname: string;
    username?: string;
    dateOfBirth?: string;
    tel?: string;
    role: string;
    department?: string;
    contenthash?: string;
    status: string;
    lastLogin: string;
    token: string;
    //deliveryAddress: string;
}