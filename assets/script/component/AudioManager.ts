// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.AudioClip
    })
    backGroupSound: cc.AudioClip = null;

    _loop: boolean = true;

    @property({
        range: [0, 1, 0.1],
        slide: true,
    })
    _soundVolume: number = 1;

    @property({
        type: cc.AudioClip
    })
    audioClipPool: Array<cc.AudioClip> = [];

    _isPlaying: boolean = false;
    _audioId: any;
    _effectId: any;

    playBackGroundSound () {
        cc.audioEngine.stopAll();
        this._audioId = cc.audioEngine.play(this.backGroupSound, this._loop, this._soundVolume);
    }

    playEffectSound (command, loop = this._loop) {
        if (command !== null || command !== undefined) {
            switch (command) {
                case "attack_0":
                    this._effectId = cc.audioEngine.playEffect(this.audioClipPool[0], loop);
                    break;
                case "attack_1":
                    this._effectId = cc.audioEngine.playEffect(this.audioClipPool[1], loop);
                    break;
                default:
                    console.error("Command is invalid");
            }
        }
    }

    pauseAllMusic () {
        cc.audioEngine.pauseAll();
    }

    resumeAllMusic () {
        cc.audioEngine.resumeAll();
    }

    stopAllMusic () {
        cc.audioEngine.stopAll();
        this._audioId = null;
    }

    stopAllEffect () {
        cc.audioEngine.stopAllEffects();
    }
}
