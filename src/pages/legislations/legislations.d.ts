export interface ICreateSection {
  Title: string;
  OrderNumber: number;
  OrderNumberRoman: string; // Updated to be an array of IChapter
}

export interface IAllData {
  id: number;
  title: string;
  ordernumber: number;
  ordernumberroman: string;
  chapters?: any;
}

export interface IChapter {
  id?:number,
  Title: string;
  SectionId: number;
  OrderNumber: number;
}
