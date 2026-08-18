export interface Course {
  id: string;
  name: string;
  subject: string;
  grade: number;
  teacher: string;
  rating: number;
  price: number;
  durationWeeks: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  childName: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  childName: string;
  createdAt: string;
}
