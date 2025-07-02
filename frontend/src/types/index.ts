export interface User {
    ID: number;
    name: string;
    email: string;
  }
  
  export interface Document {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    title: string;
    content: string;
    isPublic: boolean;
    authorId: number;
    author: User;
  }