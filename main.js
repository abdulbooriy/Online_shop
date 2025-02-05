import express from 'express';
import dotenv from 'dotenv';
import swaggerDocs from './config/swagger.js';
import mainRoute from './routes/index.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use('/api', mainRoute);
swaggerDocs(app)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})