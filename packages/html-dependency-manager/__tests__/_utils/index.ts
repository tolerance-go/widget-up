export const formatHeadHtml = (document: Document) => {
  return document.head.innerHTML.replace(
    /(<\/script>|<link[^>]*>)(?=(<script|<link))/g,
    "$1\n"
  );
};
