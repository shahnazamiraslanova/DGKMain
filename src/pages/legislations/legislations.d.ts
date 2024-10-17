// legislation.d.ts

export interface Change {
    id: string;
    description: string;
    date: string;
  }
  
  export interface Item {
    id: string;
    title: string;
    changes: Change[];
  }
  
  export interface Chapter {
    id: string;
    title: string;
    items: Item[];
  }
  
  export interface Section {
    id: string;
    title: string;
    chapters: Chapter[];
  }
  
  export interface Data {
    sections: Section[];
  }
  