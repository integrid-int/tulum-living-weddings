import type { StructureResolver } from "sanity/structure";

type SingletonDocument = {
  documentId: string;
  schemaType: string;
  title: string;
};

const singletonDocuments: SingletonDocument[] = [
  {
    documentId: "siteSettings",
    schemaType: "siteSettings",
    title: "Site Settings"
  },
  {
    documentId: "navigation",
    schemaType: "navigation",
    title: "Navigation"
  },
  {
    documentId: "pageHome",
    schemaType: "pageHome",
    title: "Home Page"
  },
  {
    documentId: "pageHowWeHelp",
    schemaType: "pageHowWeHelp",
    title: "How We Help Page"
  },
  {
    documentId: "pageWhyUs",
    schemaType: "pageWhyUs",
    title: "Why Us Page"
  },
  {
    documentId: "pageContact",
    schemaType: "pageContact",
    title: "Contact Page"
  },
  {
    documentId: "pageGallery",
    schemaType: "pageGallery",
    title: "Gallery Page"
  },
  {
    documentId: "pageTestimonials",
    schemaType: "pageTestimonials",
    title: "Testimonials Page"
  },
  {
    documentId: "pageFaq",
    schemaType: "pageFaq",
    title: "FAQ Page"
  },
  {
    documentId: "pagePricing",
    schemaType: "pagePricing",
    title: "Pricing Page"
  }
];

export const singletonTypes = new Set(
  singletonDocuments.map((singletonDocument) => singletonDocument.schemaType)
);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...singletonDocuments.map((singletonDocument) =>
        S.listItem()
          .id(`${singletonDocument.schemaType}-singleton`)
          .title(singletonDocument.title)
          .child(
            S.editor()
              .id(singletonDocument.documentId)
              .schemaType(singletonDocument.schemaType)
              .documentId(singletonDocument.documentId)
          )
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const typeId = listItem.getId();

        if (!typeId) {
          return true;
        }

        return !singletonTypes.has(typeId);
      })
    ]);
