const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');

const launchServer = async () => {
  try {
    const expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    expressServer.app.get('/ping',(_,res)=>{
        return res.send('pong');
    });
    expressServer.launch();
    logger.info('Express server running');
  } catch (error) {
    console.log(error);
    logger.error('Express Server failure', error.message);
    await this.close();
  }
};

launchServer().catch(e => logger.error(e));
