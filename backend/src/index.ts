import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { rootRouter } from './routes';
const app = express();


app.use(cors({
    origin: "https://second-brain-self.vercel.app", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

app.use("/api/v1",rootRouter);

app.listen(PORT , ()=>{
    console.log(`server is running at port ${PORT}`);
})
