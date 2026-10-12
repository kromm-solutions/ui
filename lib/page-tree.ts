import type {
  Node as PageTreeNode,
  Root as PageTreeRoot,
} from "fumadocs-core/page-tree";

import { ROUTES } from "@/constants/routes";

export type PageTreeFolder = Extract<PageTreeNode, { type: "folder" }>;
export type PageTreePage = Extract<PageTreeNode, { type: "page" }>;

export const getPagesFromFolder = (folder: PageTreeFolder): PageTreePage[] =>
  folder.children.filter(
    (child): child is PageTreePage => child.type === "page"
  );

export const getAllPagesFromFolder = (
  folder: PageTreeFolder
): PageTreePage[] => {
  const pages: PageTreePage[] = [];

  for (const child of folder.children) {
    if (child.type === "page") {
      pages.push(child);
    } else if (child.type === "folder") {
      pages.push(...getAllPagesFromFolder(child));
    }
  }

  return pages;
};

/**
 * Component pages of `folder`, one per component instead of one per base.
 * Every base has its own `/docs/components/<base>/<slug>` page, so listing the
 * folder as-is repeats a component once per base. Keep the first occurrence and
 * drop the rest; the base switcher on the page covers the other variants.
 */
export const getUniqueComponentPages = (
  folder: PageTreeFolder
): PageTreePage[] => {
  const seen = new Set<string>();

  return getAllPagesFromFolder(folder).filter((page) => {
    if (page.url === ROUTES.DOCS_COMPONENTS) {
      return false;
    }

    const slug = page.url.slice(page.url.lastIndexOf("/") + 1);
    if (seen.has(slug)) {
      return false;
    }

    seen.add(slug);
    return true;
  });
};

export const filterTreeByBase = <T extends PageTreeRoot | PageTreeFolder>(
  node: T,
  activeBase: string
): T => {
  const filteredChildren = node.children
    .map((child) => {
      if (child.type === "page") {
        if (child.url.startsWith("/docs/components/")) {
          if (
            !child.url.startsWith(`/docs/components/${activeBase}/`) &&
            child.url !== `/docs/components/${activeBase}`
          ) {
            return null;
          }
        }
        return child;
      }
      if (child.type === "folder") {
        const filteredFolder = filterTreeByBase(child, activeBase);
        return filteredFolder.children.length > 0 ? filteredFolder : null;
      }
      return child;
    })
    .filter((child): child is PageTreeNode => child !== null);

  return {
    ...node,
    children: filteredChildren,
  };
};
