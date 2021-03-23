// CORS

const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
    if (req.method === "OPTIONS") {
      return res.status(200).send("OK");
    }
    next();
  
}

module.exports = corsMiddleware;
