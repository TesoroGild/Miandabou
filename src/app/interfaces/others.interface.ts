export interface UserImageData {
  data: string;
  type: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
    username: string;
    token: string;
    mail: string;
    role: string;
    // description : string;
    // picture : string;
    // video : string;
    // price : string;
}

export interface Email {
    from: string;
    to: string;
    subject: string;
    text: string;
}

export interface Blog {
    id: string;
    title: string;
    author: string;
    description : string;
    picture: string;
    contenthash : string;
    video : string;
    datePosted: string;
}