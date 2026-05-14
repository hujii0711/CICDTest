const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Data (In-memory)
let posts = [
    { id: 1, title: '첫 번째 게시글', content: '안녕하세요, 반갑습니다.', author: '관리자', createdAt: new Date() },
    { id: 2, title: 'Node.js 공부 중', content: '익스프레스와 EJS를 배우고 있습니다.', author: '학습자', createdAt: new Date() }
];

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/post/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.render('post', { post });
});

app.get('/write', (req, res) => {
    res.render('form', { post: null });
});

app.post('/write', (req, res) => {
    const { title, content, author } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author,
        createdAt: new Date()
    };
    posts.unshift(newPost);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.render('form', { post });
});

app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, author } = req.body;
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Post not found');
    
    posts[index] = { ...posts[index], title, content, author };
    res.redirect(`/post/${id}`);
});

app.post('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
