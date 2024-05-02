export const formatHeadHtml = (document: Document) => {
  return document.head.innerHTML.replace(
    /(<\/script>|<link[^>]*>)(?=(<script|<link))/g,
    "$1\n"
  );
};


export const formatElementHtml = (el: HTMLElement) => {
  return el.innerHTML.replace(
    /(<\/script>|<link[^>]*>)(?=(<script|<link))/g,
    "$1\n"
  );
};
