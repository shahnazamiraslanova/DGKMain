export interface Option {
    id: number;
    optionContent: string;
  }
  
  export interface Poll {
    pollId: number;
    pollTitle: string;
    userId: number;
    options: Option[];
    firmIds: number[];
  }
  
  export interface Firm {
    id: string;
    name: string;
  }
  
  export interface Vote {
    optionId: number;
    count: number;
  }
  