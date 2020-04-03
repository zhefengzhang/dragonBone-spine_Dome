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
        displayName: "角色移动速度",
        range: [0, 1, 0.01]
    })

    speed: number = 1;

    //角色移动方向 1 为向右移动 -1 为向左移动
    _myDirection: number = 1;

    //角色是否可以移动
    _canMove: boolean = false;

    start () {

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
    }
}
