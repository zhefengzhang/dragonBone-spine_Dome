// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        test: dragonBones.ArmatureDisplay,
    },

    // LIFE-CYCLE CALLBACKS:

    changeBtnClicked() {
        var data = this.test.armature().clock;
        cc.loader.loadRes('Monster/monsterbone001_0_ske', dragonBones.DragonBonesAsset, (err, res) => {

            cc.loader.loadRes('Monster/monsterbone001_0_tex', dragonBones.DragonBonesAtlasAsset, (err2, res2) => {

                this.test.dragonAsset = res;
                this.test.dragonAtlasAsset = res2;
                this.test.armature().clock = data;
            })
        })
    }
    // update (dt) {},
});
