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
        type: dragonBones.ArmatureDisplay,
        displayName: "角色骨骼动画_0"
    })
    dBones_0: dragonBones.ArmatureDisplay = null;

    playWarp (event, customData, target) {
        if (cc.find("Canvas").getComponent("Main")._heroDead) return;
        var targetDBones = this.dBones_0;
        if (target instanceof dragonBones.ArmatureDisplay) targetDBones = target;
        switch (customData) {
            case "warp_0":
                targetDBones.playAnimation("hweaponattack", -1);
                cc.find("Canvas").getComponent("AudioManager").playEffectSound("attack_1", false);
            break;
            case "warp_1":
                targetDBones.playAnimation("staffattack", -1);
                cc.find("Canvas").getComponent("AudioManager").playEffectSound("attack_1", false);
            break;
        }
        targetDBones.timeScale = 0.5;
        targetDBones.on(dragonBones.EventObject.LOOP_COMPLETE,()=>{
            targetDBones.timeScale = 1;
            targetDBones.playAnimation("walk", 0);
        })
    }
    // update (dt) {}
}
