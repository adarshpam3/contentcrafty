
export interface Topic {
  title: string;
  h2Headings: string[];
  options: {
    addH2: boolean;
    faq: boolean;
    tableOfContents: boolean;
    generateImage: boolean;
  };
}

export interface Category {
  storeName: string;
  categoryName: string;
  keywords: string;
  keyFeatures: string;
}
