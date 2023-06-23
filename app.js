const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();

app.use(express.static('public'))
app.use(morgan('dev'))

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const posts = postBank.find(id);

  if (!posts.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
      </div>
    </body>
    </html>`
    res.send(html)
  } else{
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
          <p>
            <span class="news-position">${posts.id}. ▲</span>${posts.title}
            <small>(by ${posts.name})</small>
          </p>
          <p>
          <span class="news-position">${posts.content}</span>
          </p>
          <small class="news-info">
            ${posts.upvotes} upvotes | ${posts.date}
          </small>
        </div>
    </div>
  </body>
</html>`;
  res.send(html)
}});
app.get("/", (req, res) => {
  const posts = postBank.list();

  const html =`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(posts => `
        <div class='news-item'>
          <p>
            <span class="news-position">${posts.id}. ▲</span>
            ${posts.title}
            <small>(by ${posts.name})</small>
          </p>
          <small class="news-info">
            ${posts.upvotes} upvotes | ${posts.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`

  res.send(html);
});

app.use((req, res)=>{
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
      </div>
    </body>
    </html>`
  )
})

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
