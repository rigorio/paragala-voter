export class ItemCache {
  static itemMap = new Map();

  public static show() {
    console.log("item-cache")
    console.log(ItemCache.itemMap)
    console.log("item-cache")
  }

  public static add(title, company, category) {
    let item = new Item(title, company);
    ItemCache.itemMap.set(category, item);
  }

  public static has(key: string) {
    return this.itemMap.has(key);
  }

}

class Item {
  title: string;
  company: string;

  constructor(title: string, company: string) {
    this.title = title;
    this.company = company;
  }
}
