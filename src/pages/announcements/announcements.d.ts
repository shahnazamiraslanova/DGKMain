export interface IFormValues {
    title: string;
    body: string;
    fruit: string[];
    check: boolean;
    date: string;
    time: string;
    car: string;
    language: string;
    languages: string[];
}
// src/interfaces.ts
export interface Announcement {
    id: number;
    title: string;
    content: string;
    createdDate: string;
    files?: string[]; // Optional, adjust as necessary
  }
  