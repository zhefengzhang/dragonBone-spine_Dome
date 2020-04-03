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

    @property({
        displayName: "角色节点们",
        type: cc.Node
    })
    heroNodes: Array<cc.Node> = [];

    //time
    _time: number = 0;

    //cc.director.getFrameRate()
    _rameRate: number = 0;

    //游戏正在进行
    _heroDead: boolean = false;

    onLoad () {
        this._rameRate = cc.game.getFrameRate();
        this.scheduleOnce(()=>{
            let collisionManager = cc.director.getCollisionManager();
            collisionManager.enabled = true;
            collisionManager.enabledDebugDraw = true;
        });
        this.node.on("hero_dead",()=>{
            this.time = 0;
        }, this);
    }

    start () {
        cc.find("Canvas").getComponent("AudioManager").playBackGroundSound();
        var _hero_0 = this.heroNodes[0].getChildByName("Infos").getChildByName("Label Message");
        var _hero_1 = this.heroNodes[1].getChildByName("Infos").getChildByName("Label Message");
        cc.tween(_hero_1)
            .to(1, {opacity: 255})
            .call(()=>{
                cc.tween(_hero_0)
                    .to(1, {opacity: 255})
                    .call(()=>{
                        cc.tween(_hero_0)
                            .to(1, {opacity: 0})
                            .start()
                        cc.tween(_hero_1)
                            .to(1, {opacity: 0})
                            .start()
                        this.node.getComponent("DragonBonesFight")._robotAutoMove = true;
                    })
                    .start();
            })
            .start()
    }
    
    onTimeEnd () {
        cc.find("Canvas").getComponent("AudioManager").stopAllEffect();
        this.tips.string = "你输了, 2s 之后重新开始游戏";
        for (let i = 0; i < this.heroNodes.length; i++) {
            var _hearo = this.heroNodes[i].children[1];
            _hearo.getComponent(dragonBones.ArmatureDisplay).playAnimation("dead", 0);
        }
        this._heroDead = true;
        setTimeout(()=>{
            cc.director.loadScene("dragonBonesAttack");
        }, 2000);
    }

    update () {
        if (this.time < 0) return; 
        if (this.time === 0) {
            this.time -= 1;
            this.onTimeEnd();
        }
        else {
            this._time++;
            if (this._time >= this._rameRate) {
                this._time = 0;
                this.time -= 1;
                this.tips.string = `time: ${this.time} s`
            }
        }
    }
}
