
export interface IQuiz {
    id: number;
    title: string;
  }
  export interface IQuestion {
    id: number;
    content: string;
  }
  
  export interface IOption {
    id: number;
    content: string;
    isTrue: boolean;
  }
  export interface IUser {
    id: number,
    name: string,
    surname: string,
    departmentId: number,
    fatherName: string
  }
  export interface ISelectedUser {
    id: number
  }
  export  interface IGroup {
    id: number;
    title: string;
  }