const connectDB = require('./config/db');
const loadInitialProducts = require('./data/loadInitialProducts');

//conectar a la DB y luego cargar productos
connectDB().then(loadInitialProducts);

const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const viewsRouter = require('./routes/views.router');
const Product = require('./models/Product.model');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//configurar sesiones
app.use(session({
    secret: 'tuClaveSecreta123',
    resave: false,
    saveUninitialized: true
}));

//middleware para exponer cartId a las vistas
app.use((req, res, next) => {
    res.locals.cartId = req.session.cartId || null;
    next();
});

//configurar handlebars
app.engine('handlebars', engine({
    helpers: {
        multiply: (a, b) => a * b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

//rutas API
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

//rutas de vistas
app.use('/', viewsRouter);

//vista raíz (home)
app.get('/', async (req, res) => {
    const products = await Product.find().lean();
    res.render('home', { products });
});

//vista realtimeproducts con socket.io
app.get('/realtimeproducts', async (req, res) => {
    const products = await Product.find().lean();
    res.render('realTimeProducts', { products });
});

//webSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('addProduct', async (product) => {
        await Product.create(product);
        const products = await Product.find().lean();
        io.emit('updateProductList', products);
    });

    socket.on('deleteProduct', async (productId) => {
        await Product.findByIdAndDelete(productId);
        const products = await Product.find().lean();
        io.emit('updateProductList', products);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

//iniciar servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});