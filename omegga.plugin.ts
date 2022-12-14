import OmeggaPlugin, { OL, PS, PC } from 'omegga';

type Config = { foo: string };
type Storage = { bar: string };

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: any;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    let globalTeam: string = "0"
    //1. once per second, finds all players currently not in any minigame.
    const authorizedRoles = this.config["authorized-roles"]

    setInterval(async ()=>{
      let players = Omegga.players
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        //2. remove player and continue if they have appropriate role.
        const roles = player.getRoles()
        let isAuthorized = false
        for (let j = 0; j < roles.length; j++) {
          const role = roles[j];
          for (let k = 0; k < authorizedRoles.length; k++) {
            const authorizedRole = authorizedRoles[k];
            if(role === authorizedRole){
              isAuthorized = true
            }
          }
        }
        if(!isAuthorized){
          
          //3. check each player for being in a minigame if not, move them to the default minigame. 
          //3.1 get all actors' teams. (2147482533 is the 'global minigame' team)
          const reg = new RegExp(
            /BP_PlayerState_C .+?PersistentLevel\.(?<state>BP_PlayerState_C_\d+)\.Team = .+PersistentLevel.+BP_Team_C_(?<team>\d+)/
          );
          const regExpMatchArray: RegExpMatchArray[] = await this.omegga.watchLogChunk( 'GetAll BP_PlayerState.BP_PlayerState_C Team', reg,
          {
            timeoutDelay: 500
          }
          )
          for (let j = 0; j < regExpMatchArray.length; j++) {
            const { team, state } = regExpMatchArray[j].groups;
            if(player.state === state && team === globalTeam) {
              //3.2 set everyone who doesn't match criteria to the preferred minigame index.
              player.setMinigame(this.config['Default-minigame'])
            }
          }
        }
      }
    }, this.config['check-interval']*1000)

    Omegga.on('cmd:calibrate-gm', async (speaker: string) => {
      const player = Omegga.getPlayer(speaker)
      if(!player.isHost){
        Omegga.whisper(speaker, `Only the host can use this command!`);
        return;
      }
      player.setMinigame(-1)
      const state = player.state
      const reg = new RegExp(
        /BP_PlayerState_C .+?PersistentLevel\.(?<state>BP_PlayerState_C_\d+)\.Team = .+PersistentLevel.+BP_Team_C_(?<team>\d+)/
      );
      const regExpMatchArray: RegExpMatchArray[] = await this.omegga.addWatcher(reg,
      {
        exec() {
          Omegga.writeln(`GetAll BP_PlayerState.BP_PlayerState_C Team Name="${state}"`)
        },
        timeoutDelay: 100
      }
      )
      console.log(parseInt(regExpMatchArray[0].groups['team']))
      globalTeam = regExpMatchArray[0].groups['team']
      Omegga.whisper(speaker, `Global Team (minigame) calibrated to ${globalTeam}!`)
    })

    return { registeredCommands: ['calibrate-gm'] };
  }

  async stop() {
    // Anything that needs to be cleaned up...
  }
}
