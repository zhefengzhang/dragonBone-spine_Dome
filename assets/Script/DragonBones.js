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

    changeBtnClicked () {
        var self = this;
        var data = this.test.armature().clock;
        cc.loader.loadResDir('Monster/monsterbone001_0_ske', function(err, res){

            cc.loader.loadResDir('Monster/monsterbone001_0_tex', function(err2, res2){

                self.test.dragonAsset = res[0];
                self.test.dragonAtlasAsset = res2[2];
                self.test.armature().clock = data;
            })
        })
    }
    // update (dt) {},
});
