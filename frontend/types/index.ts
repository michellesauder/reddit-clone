export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string | null;
  link: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    email?: string;
  };
  _count: {
    votes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  replies?: Comment[];
  _count: {
    votes: number;
    replies: number;
  };
}
