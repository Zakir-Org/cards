import express from 'express';
import apiRoutes from './api/routes';

const app = express();

// Other middleware (body-parser, cors, etc)
// ...

// Use the API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
