import AuthRouter from "./Auth";

function route(app) {
  // authentication
  app.use("/api/v1/auth", AuthRouter);
}

export default route;
