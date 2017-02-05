function Polygon () {
    var pointList = [];
    this.node = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    function build (arg) {
        var res = [];
        for (var i=0,l=arg.length;i<l;i++) {
            res.push(arg[i].join(','));
        }
        return res.join(' ');
    }
    this.attribute = function (key,val) {
        if (val === undefined) return node.getAttribute(key);
        this.node.setAttribute(key,val);
    }
    this.getPoint = function (i) {return pointList[i]}
    this.setPoint = function (i,x,y) {
        pointList[i] = [x,y];
        this.attribute('points', build(pointList));
    }
    this.points = function () {
      for (var i=0,l=arguments.length;i<l;i+=2) {
          pointList.push([arguments[i],arguments[i+1]]);
      }
      this.attribute('points',build(pointList));
    }
    // initialize 'points':
    this.points.apply(this,arguments);
}

export {Polygon}
