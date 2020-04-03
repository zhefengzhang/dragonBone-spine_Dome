const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //节点碰撞分组
    _collisionGroup: string = "default";

    //玩家角色节点
    _playerTarget: cc.Node = null;

    //玩家角色骨骼组件
    _playerDBones: dragonBones.ArmatureDisplay = null;

    //机器人角色节点
    _robotTarget: cc.Node = null;

    //机器人角色骨骼组件
    _robotDBones: dragonBones.ArmatureDisplay = null;

    //角色攻击组件
    _attack: null;

    //角色信息节点
    _infos: cc.Node = null;

    //玩家角色 HP 精灵
    _playerHp: cc.Sprite = null;
    
    //Robot HP 精灵
    _robotHp: cc.Sprite = null;

    onLoad () {
        this._collisionGroup = this.node.group;
    }

    start () {
        this._playerTarget = cc.find("Canvas/Hero_0");
        this._playerDBones = this._playerTarget.getChildByName("DBones Hero_0").getComponent(dragonBones.ArmatureDisplay);
        this._playerHp = this._playerTarget.getChildByName("Infos").getChildByName("Sprite HP").getComponent(cc.Sprite);
        this._robotTarget = cc.find("Canvas/Hero_1");
        this._robotDBones = this._robotTarget.getChildByName("DBones Hero_1").getComponent(dragonBones.ArmatureDisplay);
        this._robotHp = this._robotTarget.getChildByName("Infos").getChildByName("Sprite HP").getComponent(cc.Sprite);

        this._attack = cc.find("Canvas/Control/Attack").getComponent("Attack");
    }

    onCollisionEnter () {
        var playerHitLabelNode = this._playerTarget.getChildByName("Infos").getChildByName("Label Hit");
        var robotHitLabelNode = this._robotTarget.getChildByName("Infos").getChildByName("Label Hit");
        switch (this._collisionGroup) {
            case cc.game.groupList[1]:
                if (this._playerHp.fillRange < 0.1) {
                    cc.find("Canvas").emit("hero_dead");
                }
                else {
                    this._playerHp.fillRange -= 0.1;
                    cc.tween(playerHitLabelNode)
                        .set({opacity: 255})
                        .to(0.5, {opacity: 0})
                        .start()
                }
                break;
            case cc.game.groupList[2]:
                if (this._robotHp.fillRange < 0.1) {
                    var robotInfos = this._robotTarget.getChildByName("Infos");
                    var robotMessage = robotInfos.getChildByName("Label Message");
                    var robotMessageLabel = robotMessage.getComponent(cc.Label);
                    robotMessageLabel.string = "有本事别跑~";
                    cc.tween(robotMessage)
                        .to(1, {opacity: 255})
                        .call(()=>{
                            cc.tween(robotMessage)
                                .to(1, {opacity: 0})
                                .start();
                        })
                        .start();
                }
                this._robotHp.fillRange -= 0.1;
                setTimeout(()=>{
                    if (this._attack) this._attack.playWarp(null, "warp_0", this._robotDBones);
                }, 200);
                cc.find("Canvas").getComponent("DragonBonesFight")._robotAutoMove = false;
                if (this._robotHp.fillRange >= 0) {
                    cc.tween(robotHitLabelNode)
                        .set({opacity: 255})
                        .to(0.5, {opacity: 0})
                        .start()
                }
                break;
        }
        cc.find("Canvas").getComponent("AudioManager").playEffectSound("attack_0", false);
    }

    onCollisionExit () {

    }
}
