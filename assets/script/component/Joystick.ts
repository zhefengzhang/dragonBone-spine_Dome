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
        displayName: "目标节点"
    })
    targetNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "虚拟摇杆节点"
    })
    myJoystickPoint: cc.Node = null;

    @property({
        displayName: "最大拖动距离",
        range: [0, 200, 10]
    })
    mMaxDistance: number = 100;

    start () {
        this.myJoystickPoint.position = cc.v3(0, 0, 0);
        this.enableTouchListen();
    }

    enableTouchListen () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    disableTouchListen () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();//获得当前触摸点的坐标
        var moveToPos = this.node.convertToNodeSpaceAR(touchLoc);
        if (moveToPos.mag() <= this.mMaxDistance)
        {
            this.myJoystickPoint.position = moveToPos;
        }
        else
        {
            var direction = moveToPos.normalize();
            this.myJoystickPoint.position = direction.mul(this.mMaxDistance);
        }
    }

    onTouchMove (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();//获得当前触摸点的坐标
        var moveToPos = this.node.convertToNodeSpaceAR(touchLoc);
        if (moveToPos.mag() <= this.mMaxDistance)
        {
            this.myJoystickPoint.position = moveToPos;
        }
        else
        {
            var direction = moveToPos.normalize();
            this.myJoystickPoint.position = direction.mul(this.mMaxDistance);
        }
        var offsetX = this.node.convertToNodeSpaceAR(touchLoc).x;
        if (this.targetNode && cc.isValid(this.targetNode)) 
            cc.find("Canvas").getComponent("DragonBonesFight").moveControl(offsetX, true);
    }

    onTouchEnd () {
        this.myJoystickPoint.position = cc.v3(0, 0, 0);
        cc.find("Canvas").getComponent("DragonBonesFight").moveControl(0, false);
    }

    getDirection () {
        return this.myJoystickPoint.position;
    }

    onDestroy () {
        this.disableTouchListen();
    }
}
