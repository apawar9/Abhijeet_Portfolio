# Abhijeet Portfolio

This repository contains the portfolio site for **Abhijeet Pawar**. The site showcases work experience, projects and certifications in cybersecurity.

## Development

The site has been broken into individual HTML components which are assembled by
a small Node.js server. This makes it easier to modify each section separately.

### Run locally

```
npm start
```

The server reads the files in the `components` directory and serves the page at
`http://localhost:3000`.

### Build static page

To generate `public/index.html` from the components run:

```
npm run build
```

You can still open the generated `public/index.html` directly in your browser.
