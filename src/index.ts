import express from 'express';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './api/routes';
import YAML from 'yamljs';
import cors from 'cors';

const app = express();

// Load Swagger YAML file
const swaggerDocument = YAML.load('./src/api/docs/recommendSingleCard.yaml');

app.use(express.json());

// Enable All CORS Requests
app.use(cors());

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use the API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
