import {StoreInterface} from '../store';
import Logger from '../log';

class SetArgs {
  public key !: string;
  public value !: string;
  public options !: object;
};

// Proxy which can execute commands on a store.
export default class CommandProxy {
  private store : StoreInterface;
  private COMMAND_MAP : {[s:string] : Function} = {
    'set': this.set,
  };

  constructor(store: StoreInterface) {
    this.store = store;
  }

  call(command: string, args: any) {
    const commandLower = command.toLowerCase();

    if (!this.COMMAND_MAP.hasOwnProperty(commandLower)) {
      return Logger.error(`Failed to execute command, no matching handler for command '${commandLower}'`)
    }

    // Validate the command payload.
    this.COMMAND_MAP[commandLower](Object.setPrototypeOf(args, SetArgs.prototype));
  }

  private mapArgsForCommand(command: string, args : any) {
    const mappedArgs = {};

    switch (command) {
      case 'set':
        break;
    }

    return mappedArgs;
  }

  private set(args : SetArgs) {
    const {key, value, options} = args;
    this.store.Set(key, value, options);
  }
}
