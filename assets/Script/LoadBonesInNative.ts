// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    mySpineJsonUrl: string = "http://192.168.50.106:8000/assets/remoteRes/spineRaptor/raptor.json";

    mySpineTextureUrl: string = "http://192.168.50.106:8000/assets/remoteRes/spineRaptor/raptor.png";

    mySpineAtlasUrl: string = "http://192.168.50.106:8000/assets/remoteRes/spineRaptor/raptor.atlas";

    myDragonBonesJsonUrl: string = "http://192.168.50.106:8000/assets/remoteRes/dragonbones/CoreElement.json";

    myDragonBonesTextureUrl: string = "http://192.168.50.106:8000/assets/remoteRes/dragonbones/CoreElement_texture_1.png";

    myDragonBonesAtlasUrl: string = "http://192.168.50.106:8000/assets/remoteRes/dragonbones/CoreElement_texture_1.json";

    @property(cc.Label)
    myLabel: cc.Label = null;

    _downloader: any;
    _spineJsonDownloadTask: any;
    _spineTextureDownloadTask: any;
    _spineAtlasDownloadTask: any;

    _dragonbonesJsonDownloadTask: any;
    _dragonbonesTextureDownloadTask: any;
    _dragonbonesAtlasDownloadTask: any;
    
    _storagePath: string;
    _inited: any;

    _localSpineJsonUrl: string;
    _localSpineAtlasUrl: string;
    _localSpineTextureUrl: string;

    _localDragonbonesJsonUrl: string;
    _localDragonbonesAtlasUrl: string;
    _localDragonbonesTextureUrl: string;

    start () {
        if (cc.sys.isNative) {
            this.node.on("downloadBonesAssetsFinish", ()=>{
                this.myLabel.string = "download bonesAssets finish!";
                this.loadSpine();
                this.loadDragonBones();
            });
            this.downloadAssets();
        }
    }

    downloadAssets () {
        this.myLabel.string = "download start...";
        this._downloader = new jsb.Downloader();
        this._downloader.setOnFileTaskSuccess(this.onSucceed.bind(this));
        this._downloader.setOnTaskProgress(this.onProgress.bind(this));
        this._downloader.setOnTaskError(this.onError.bind(this));
        this._storagePath = jsb.fileUtils.getWritablePath() + 'dragonBone-spine_Dome/downloader/';

        this._inited = jsb.fileUtils.createDirectory(this._storagePath);
        if (!this._inited) {
            this.myLabel.string = 'Failed to create storage path, downloader won\'t work correctly';
        }

        this._spineJsonDownloadTask = this._downloader.createDownloadFileTask(this.mySpineJsonUrl, this._storagePath + 'raptor.json');
        this._spineTextureDownloadTask = this._downloader.createDownloadFileTask(this.mySpineTextureUrl, this._storagePath + 'raptor.png');
        this._spineAtlasDownloadTask = this._downloader.createDownloadFileTask(this.mySpineAtlasUrl, this._storagePath + 'raptor.atlas');

        this._dragonbonesJsonDownloadTask = this._downloader.createDownloadFileTask(this.myDragonBonesJsonUrl, this._storagePath + 'CoreElement.json');
        this._dragonbonesTextureDownloadTask = this._downloader.createDownloadFileTask(this.myDragonBonesTextureUrl, this._storagePath + 'CoreElement_texture_1.png');
        this._dragonbonesAtlasDownloadTask = this._downloader.createDownloadFileTask(this.myDragonBonesAtlasUrl, this._storagePath + 'CoreElement_texture_1.json');
    }

    onSucceed (task) {
        switch (task.requestURL) {
            case this.mySpineJsonUrl:
                this._localSpineJsonUrl = task.storagePath;
                break;
            case this.mySpineAtlasUrl:
                this._localSpineAtlasUrl = task.storagePath;
                break;
            case this.mySpineTextureUrl:
                this._localSpineTextureUrl = task.storagePath;
                break;
            case this.myDragonBonesJsonUrl:
                this._localDragonbonesJsonUrl = task.storagePath;
                break;
            case this.myDragonBonesAtlasUrl:
                this._localDragonbonesAtlasUrl = task.storagePath;
                break;
            case this.myDragonBonesTextureUrl:
                this._localDragonbonesTextureUrl = task.storagePath;
                break;
        }
        if (this._localSpineJsonUrl !== undefined && this._localSpineAtlasUrl !== undefined && this._localSpineTextureUrl !== undefined
            && this._localDragonbonesJsonUrl !== undefined && this._localDragonbonesAtlasUrl !== undefined && this._localDragonbonesTextureUrl !== undefined) {
            this.node.emit("downloadBonesAssetsFinish");
        }
    }

    onProgress (task, bytesReceived, totalBytesReceived, totalBytesExpected) {
        this.myLabel.string = "downloading..."
    }

    onError () {
        this.myLabel.string = "download error!";
    }

    loadSpine () {
        var spineNode = this.node.getChildByName("spine");
        var skeleton = spineNode.addComponent(sp.Skeleton);
        var imageUrl = this._localSpineTextureUrl;
        var skeUrl = this._localSpineJsonUrl;
        var atlasUrl = this._localSpineAtlasUrl;
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
                });
            });
        });
    }

    loadDragonBones () {
        var dragonbonesNode = this.node.getChildByName("dragonBones");
        var dragonDisplay = dragonbonesNode.addComponent(dragonBones.ArmatureDisplay);

        var imageUrl = this._localDragonbonesTextureUrl;
        var skeUrl = this._localDragonbonesJsonUrl;
        var atlasUrl = this._localDragonbonesAtlasUrl;
        cc.loader.load(imageUrl, (error, texture) => {
            cc.loader.load({ url: atlasUrl, type: 'txt' }, (error, atlasJson) => {
                cc.loader.load({ url: skeUrl, type: 'txt' }, (error, dragonBonesJson) => {
                    var atlas = new dragonBones.DragonBonesAtlasAsset();
                    atlas._uuid = atlasUrl;
                    atlas.atlasJson = atlasJson;
                    atlas.texture = texture;

                    var asset = new dragonBones.DragonBonesAsset();
                    asset._uuid = skeUrl;
                    asset.dragonBonesJson = dragonBonesJson;

                    dragonDisplay.dragonAtlasAsset = atlas;
                    dragonDisplay.dragonAsset = asset;

                    dragonDisplay.armatureName = 'mecha_1502b';
                    dragonDisplay.playAnimation('walk', 0);
                });
            });
        });
    }
    // update (dt) {}
}