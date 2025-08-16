import express from 'express';
import { createApp } from './Server';

const { app, httpServer } = createApp();
const port = 3000;

// Serve the compiled client
app.use(express.static('dist/client'));

httpServer.listen(port, () => {
  console.log(`[PROD] Server listening on port ${port}`);
});
