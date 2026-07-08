const { env, logEnvironmentSummary } = require("./src/config/env");
logEnvironmentSummary();

const { app, frontendDirectory, indexPath, scriptPath, stylePath } = require("./src/app");

if (env.nodeEnv === "development") {
  console.log(`Static frontend path: ${frontendDirectory}`);
  console.log(`Serving index.html from: ${indexPath}`);
  console.log(`Serving script.js from: ${scriptPath}`);
  console.log(`Serving style.css from: ${stylePath}`);
}

const server = app.listen(env.port, () => {
  console.log(`Nidhi Path backend listening on http://localhost:${env.port} (Supabase database mode)`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Stop the other process or set PORT to another value.`);
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});
