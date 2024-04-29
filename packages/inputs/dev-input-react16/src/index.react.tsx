import React from "react"; 
import ReactDOM from "react-dom"; 

const rootElement = document.getElementById("root"); 

<% if (dependencies.react && major(cleanVersion(dependencies.react)) >= 18) { %> 
    const root = ReactDOM.createRoot(rootElement);
    root.render(<DevGlobalApp />);
<% } else { %>
    ReactDOM.render(<DevGlobalApp />, rootElement);
<% } %>
