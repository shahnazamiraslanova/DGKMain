// export interface Reference {
//   referenceId: number;
//   referenceName: string;
// }

// export interface Subarticle {
//   subarticleId: number;
//   subarticleContent: string;
//   references: Reference[];
// }

// export interface Article {
//   articleId: number;
//   articleContent: string;
//   subarticles: Subarticle[];
// }

// export interface Chapter {
//   chapterId: number;
//   chapterTitle: string;
//   articles: Article[];
// }

// export interface Section {
//   sectionId: number;
//   sectionTitle: string;
//   chapters: Chapter[];
//   sectionOrderNumber:any;
// }

// export interface ApiResponse<T> {
//   code: number;
//   data: T;
// }

// export interface CreateItemPayload {
//   title?: string;
//   content?: string;
//   sectionId?: number;
//   chapterId?: number;
//   articleId?: number;
//   subarticleId?: number;
//   section_Order_Number:string;
// }



export interface ICreateSection{
  title: string,
  section_Order_Number: string
}