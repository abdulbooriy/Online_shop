import express from 'express';
import dotenv from 'dotenv';
<<<<<<< HEAD
import userRote from './routes/user.routes.js';
import swaggerDocs from './config/swagger.js';
=======
import mainRoute from './routes/index.js';
>>>>>>> 8d4e89b2ff7ba7120c0916d8dd06e0d389085e20

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/api', mainRoute);

app.use('/api',userRote);
swaggerDocs(app)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})  