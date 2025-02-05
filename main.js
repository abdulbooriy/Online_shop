import express from 'express';
import dotenv from 'dotenv';
import userRote from './routes/user.routes.js';
import swaggerDocs from './config/swagger.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/api',userRote);
swaggerDocs(app)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})  