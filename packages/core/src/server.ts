import {createServer} from './index';

if (require.main === module) {
  const server = createServer();
  server.listen({port: 9999, host: '127.0.0.1'}).then(() => {
    console.log('TokenKlaw core listening on http://127.0.0.1:9999');
  }).catch(err => {
    console.error('failed to start', err);
    process.exit(1);
  });
}
