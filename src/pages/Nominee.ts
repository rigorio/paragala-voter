export class Nominee {
  id: number;
  title: string;
  company: string;
  category: string;

  constructor(id: number, title: string, company: string, category: string) {
    this.id = id;
    this.title = title;
    this.company = company;
    this.category = category;
  }
}
