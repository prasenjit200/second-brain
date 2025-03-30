import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { rootRouter } from './routes';
const app = express();


app.use(cors({
    origin: "https://second-brain-1-qe9c.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // If you're using cookies or authorization headers
}));

app.use(express.json());

app.use("/api/v1",rootRouter);

app.listen(PORT , ()=>{
    console.log(`server is running at port ${PORT}`);
})
