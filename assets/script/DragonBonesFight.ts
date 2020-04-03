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
        type: cc.Node,
        displayName: "玩家操控的节点"
    })
    controlNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "电脑操控的节点"
    })
    robotNode: cc.Node = null;

    @property({
        displayName: "角色移动速度",
        range: [0, 1, 0.01]
    })

    speed: number = 1;

    //角色移动方向 1 为向右移动 -1 为向左移动
    _myDirection: number = 1;

    //角色是否可以移动
    _canMove: boolean = false;

    //电脑角色是否可以自行移动
    _robotAutoMove: boolean = false;

    //角色攻击组件
    _attack: any;
    
    start () {
        this.onKeyboradInput();

        this._attack = cc.find("Canvas/Control/Attack").getComponent("Attack");
    }

    onKeyboradInput () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,(event)=>{
            switch (event.keyCode) {
                case cc.macro.KEY.w:
                case cc.macro.KEY.s:
                    break;
                case cc.macro.KEY.a:
                    this.moveControl(-1, true);
                    break;
                case cc.macro.KEY.d:
                    this.moveControl(1, true);
                    break;
                case cc.macro.KEY.j:
                    this._attack.playWarp(null, "warp_0", null);
                    break;
                case cc.macro.KEY.k:
                    this._attack.playWarp(null, "warp_1", null);
                    break;
            }
        }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,(event)=>{
            switch (event.keyCode) {
                case cc.macro.KEY.w:
                case cc.macro.KEY.s:
                    break;
                case cc.macro.KEY.a:
                    this.moveControl(0, false);
                    break;
                case cc.macro.KEY.d:
                    this.moveControl(0, false);
                    break;
            }
        }, this);
    }

    moveControl (direction: number, canMove: boolean) {
        this._canMove = canMove;
        if (direction === 0) return;
        this._myDirection = direction > 0 ? 1 : -1;
        if (this.controlNode.getChildByName("DBones Hero_0")) {
            this.controlNode.getChildByName("DBones Hero_0").scaleX = this._myDirection;
        }
    }

    update (dt) {
        if (this.controlNode && cc.isValid(this.controlNode) && this.speed > 0 && this._canMove) {
            this.controlNode.x += this.speed * this._myDirection;
        }
        if (this._robotAutoMove) {
            this.robotNode.x -= this.speed;
        }
    }
}
