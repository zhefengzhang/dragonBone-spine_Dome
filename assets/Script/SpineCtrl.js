cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: sp.Skeleton
    },

    properties: {
        mixTime: 0.2
    },

    onLoad() {
        var spine = this.spine = this.getComponent('sp.Skeleton');
        this._setMix('walk', 'run');
        this._setMix('run', 'jump');
        this._setMix('walk', 'jump');

        spine.setStartListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
        });
        spine.setInterruptListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
        });
        spine.setEndListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
        });
        spine.setDisposeListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
        });
        spine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'shoot') {
                this.spine.clearTrack(1);
            }
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
        });
        spine.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
        });

        this._hasStop = false;
    },

    toggleDebugSlots() {
        this.spine.debugSlots = !this.spine.debugSlots;
    },

    toggleDebugBones() {
        this.spine.debugBones = !this.spine.debugBones;
    },

    toggleTimeScale() {
        if (this.spine.timeScale === 1.0) {
            this.spine.timeScale = 0.3;
        }
        else {
            this.spine.timeScale = 1.0;
        }
    },

    stop() {
        this.spine.clearTrack(0);
        this._hasStop = true;
    },

    walk() {
        this.spine.setAnimation(0, 'walk', true);
        this._hasStop = false;
    },

    run() {
        this.spine.setAnimation(0, 'run', true);
        this._hasStop = false;
    },

    jump() {
        var oldAnim = this.spine.animation;
        this.spine.setAnimation(0, 'jump', false);
        if (oldAnim && !this._hasStop) {
            this.spine.addAnimation(0, oldAnim === 'run' ? 'run' : 'walk', true, 0);
        }
    },

    shoot() {
        this.spine.setAnimation(1, 'shoot', false);
    },

    //

    _setMix(anim1, anim2) {
        this.spine.setMix(anim1, anim2, this.mixTime);
        this.spine.setMix(anim2, anim1, this.mixTime);
    },

    start() {
        this.skeleton = this.node.getComponent(sp.Skeleton);
        this.initData();
    },

    initData() {
        this.heroArr = [
            {
                resUrl: 'spineRaptor/raptor',
                defaultAnima: 'walk'
            },
            {
                resUrl: 'spineboy/spineboy',
                defaultAnima: 'walk'
            },
            {
                resUrl: 'spineRaptor/test_guai_001',
                defaultAnima: 'walk_zhanli'
            }
        ];
        this.defaultIndex = 0;
    },

    onChangeGunEvent() {
        //--测试查找对应插槽中的图片然后替换
        var gun = this.skeleton.findSlot('gun');
        var head = this.skeleton.findSlot('head');
        var headAtta = head.attachment;
        gun.setAttachment(headAtta);
    },

    onChangeHeroEvent() {
        if (this.defaultIndex > (this.heroArr.length - 1)) this.defaultIndex = 0;
        this.loadSpine(this.heroArr[this.defaultIndex].resUrl, this.skeleton, this.heroArr[this.defaultIndex].defaultAnima);
        this.defaultIndex++;
    },

    onAddHeroEvent() {
        if (cc.find('Canvas/newHero')) {
            cc.find('Canvas/newHero').destroy();
        }
        else {
            let newNode = new cc.Node();
            newNode.name = 'newHero';
            newNode.setPosition(this.node.x, this.node.y);
            cc.find('Canvas').addChild(newNode);
            newNode.addComponent(sp.Skeleton);
            let _skeleton = newNode.getComponent(sp.Skeleton);
            this.loadSpine(this.heroArr[0].resUrl, _skeleton, this.heroArr[0].defaultAnima);
        }
    },

    loadSpine(resUrl, skeleton, anima) {
        cc.loader.loadRes(resUrl, sp.SkeletonData, function (err, sp) {
            skeleton.skeletonData = sp;
            skeleton.animation = anima;
            skeleton._updateSkeletonData();
        }.bind(this));
    },

    onLoadSpine() {
        if (cc.find('Canvas/newSpine')) {
            cc.find('Canvas/newSpine').destroy();
        }
        else {
            var spineNode = new cc.Node();
            spineNode.name = 'newSpine';
            spineNode.setPosition(49, -237);
            var skeleton = spineNode.addComponent(sp.Skeleton);
            cc.find("Canvas").addChild(spineNode);
            //TODO : 此处为你的远程资源路径
            var imageUrl = "http://127.0.0.1:5500/assets/resources/spineRaptor/raptor.png";
            var skeUrl = "http://127.0.0.1:5500/assets/resources/spineRaptor/raptor.json";
            var atlasUrl = "http://127.0.0.1:5500/assets/resources/spineRaptor/raptor.atlas";
            cc.loader.load(imageUrl, (error, texture) => {
                cc.loader.load({ url: atlasUrl, type: 'txt' }, (error, atlasJson) => {
                    cc.loader.load({ url: skeUrl, type: 'txt' }, (error, spineJson) => {

                        var asset = new sp.SkeletonData();
                        asset._uuid = skeUrl;
                        asset.skeletonJson = spineJson;
                        asset.atlasText = atlasJson;
                        asset.textures = [texture];
                        asset.textureNames = ['raptor.png'];
                        skeleton.skeletonData = asset;
                        skeleton.animation = 'walk';
                        skeleton._updateSkeletonData();
                    });
                });
            });
        }
    }
});
