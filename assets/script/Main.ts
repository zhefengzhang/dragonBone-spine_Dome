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
        displayName: "战斗时间"
    })
    time: number = 360;
    
    @property({
        type: cc.Label
    })
    tips: cc.Label = null;

    //time
    _time: number = 0;

    //cc.director.getAnimationInterval()
    _animationInterval: number = 0;

    onLoad () {
        this._animationInterval = cc.game.getFrameRate();
        this.scheduleOnce(()=>{
            let collisionManager = cc.director.getCollisionManager();
            collisionManager.enabled = true;
            collisionManager.enabledDebugDraw = true;
        });
    }

    update () {
        if (this.time <= 0) return;
        this._time++;
        if (this._time >= this._animationInterval) {
            this._time = 0;
            this.time -= 1;
            this.tips.string = `time: ${this.time} s`
        }
    }
}
