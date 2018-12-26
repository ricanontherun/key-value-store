const net = require('net');
const JsonSocket = require('json-socket');

import {CommandProxy} from './command';
import {StoreInterface} from './store';
import Logger from './log'

class Application {
  private server : any;
  private proxy !: CommandProxy;
  private opts : any;

  constructor(opts: any) {
    this.opts = opts;
    this.server = net.createServer();
    this.setupEvents();
  }

  setStore(store: StoreInterface) {
    this.proxy = new CommandProxy(store);

    return this;
  }

  start() {
    this.server.listen(this.opts.server.port);
  }

  private setupEvents() {
    this.server
      .on('listening', this.onListening.bind(this))
      .on('connection', this.onConnection.bind(this));
  }

  private onListening() {
    Logger.info(`TCP server listening on localhost:${this.opts.server.port}`);
  }

  private onConnection(socket : any) {
    Logger.info('TCP connection established, binding');

    const jsonSocket = new JsonSocket(socket);

    jsonSocket.on('message', this.handleMessage.bind(this));
  }

  private handleMessage(message : any) {
    let valid = true;

    const requiredFields = ['command', 'args'];
    requiredFields.forEach((requiredField) => {
      if (!message.hasOwnProperty(requiredField)) {
        valid = false;
        return;
      }
    });

    if (!valid) {
      return Logger.error(`Invalid message structure: ${JSON.stringify(message)}`);
    }

    this.proxy.call(message.command, message.args);
  }
}

export default Application;
