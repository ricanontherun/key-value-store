import net from 'net';
import JsonSocket from 'json-socket';
import Logger from '../app/log';

const STATE_DISCONNECTED = 0;
const STATE_CONNECTING = 1;
const STATE_CONNECTED = 2;

class Client {
  private opts: any;
  private socket: JsonSocket;
  private state: number = STATE_DISCONNECTED;

  constructor(opts : any) {
    this.opts = opts;
    this.socket = new JsonSocket(new net.Socket());

    this.setupEvents();
    this.socket.connect(this.opts.port, 'localhost');
  }

  set(key: string, value: string, opts: object = {}) {
    const command = 'set';
    const payload = {
      command,
      args: {
        key,
        value,
        opts,
      },
    };

    this.socket.sendMessage(payload, (sendErr) => {
      if (sendErr) {
        return Logger.error(`Failed to send message: ${sendErr}`);
      }

      // TODO: Wait for reply
    });
  }

  private onConnect() {
    this.state = STATE_CONNECTED;
  }

  private onClose() {
    this.state = STATE_DISCONNECTED;
  }

  private onError(err: Error) {
    Logger.error(`Socket error: ${err}`);
    this.state = STATE_DISCONNECTED;
  }

  private setupEvents() {
    this.socket
      .on('connect', this.onConnect.bind(this))
      .on('close', this.onClose.bind(this))
      .on('error', this.onError.bind(this));
  }
}

const client = new Client({
  port: 6380,
});

client.set("name", "Christian");
