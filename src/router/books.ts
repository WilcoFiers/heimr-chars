import { HeimrBook, DomainsBook } from "@/views/books";

export const bookRoutes = [
  {
    path: "/books/domains",
    name: "DomainsBook",
    component: DomainsBook
  },
  {
    path: "/books/*",
    name: "book",
    component: HeimrBook
  }
];
