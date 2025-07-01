// var text_simple = {
//   family: "Arial",
//   size: "3.5mm",
//   anchor: "middle",
// };

var text_attr = {
  "font-family": "Arial",
  "font-size": "3.5mm",
  "text-anchor": "middle",
  "text-align": "center",
};

let text_dim = {
  "font-family": "Arial",
  "font-size": "3.5mm",
  "text-anchor": "middle",
  "text-align": "center",
  fill: "purple",
  stroke: "purple",
  "stroke-width": "0.05mm",
};

var attr_bolt = {
  fill: "none",
  "stroke-width": "0.3mm",
  stroke: "black",
};
var attr_simbol = {
  fill: "black",
  "stroke-width": "0.2mm",
  stroke: "black",
};

var attr_line_thick = {
  fill: "none",
  "stroke-width": "1mm",
  stroke: "black",
};

var attr_axes = {
  fill: "none",
  "stroke-dasharray": "20,5,2,5",
  "stroke-width": "0.3mm",
  stroke: "red",
};
var attr_dotted = {
  fill: "none",
  "stroke-dasharray": "15,15",
  "stroke-width": "0.3mm",
  stroke: "green",
};

var attr_dotted_pattern = {
  fill: "none",
  "stroke-dasharray": "15,15",
  "stroke-width": "1mm",
  stroke: "gray",
};

var attr_bolt_pattern = {
  fill: "none",
  "stroke-width": "0.3mm",
  stroke: "black",
};

var attr_axes_pattern = {
  fill: "none",
  "stroke-dasharray": "40,4,2,4",
  "stroke-width": "1mm",
  stroke: "grey",
};

let moveText = mm(4);

let tableKMD = new Array();

var details = new Array();

/**
 * convert px in mm
 * @param {number} px
 * @returns {number} mm
 */
function mm(a) {
  return a * 3.779527559;
}

/**
 * general class with symbols
 */
class Base {
  constructor(draw) {
    this.draw = draw;
    this.line45 = this.draw
      .pattern(10, 1000, function (add) {
        add.rect("0.3mm", 1000);
      })
      .rotate(45);
  }

  /**
   * linear dimensions with serifs mm
   * @param {number} x - coordinate x mm
   * @param {number} y - coordinate y mm
   * @param {number} lenghtInit - c length mm
   * @param {number} rotate - rotation in degrees (optional parameter)
   * @param {number} indent - y-indent in mm (optional parameter)
   * @param {number} scale - scale (optional parameter)
   * @returns {object.draw} - you can move and clone
   */
  dimention(x, y, lenghtInit, rotate = 0, indent = 16, scale = 1) {
    x = mm(x);
    y = mm(y);
    let lenght = mm(lenghtInit);
    let a = mm(2) * scale;
    let b = mm(5.5) * scale;
    indent = mm(indent);
    let delta = indent < 0 ? a : 0;
    let color = "purple";
    let size = mm(3.5) * scale;
    var symbol = this.draw.group();
    let takeOutText = lenghtInit < 8 ? mm(7) : 0;
    symbol
      .line(
        x - a,
        y + indent + delta,
        x + lenght + a + takeOutText,
        y + indent + delta
      )
      .attr(attr_bolt)
      .attr({ stroke: color });
    let l = this.draw
      .line(x, y, x, y + indent + a)
      .attr(attr_bolt)
      .attr({ stroke: color });
    symbol.add(l);
    symbol.add(l.clone().x(lenght + x));
    let t = this.draw
      .line(x - a, y + indent + a + delta, x + a, y + indent - a + delta)
      .attr(attr_bolt)
      .attr({ stroke: color, "stroke-width": "1mm" });
    symbol.add(t);
    symbol.add(t.clone().x(lenght + x - a));
    symbol
      .text(lenghtInit.toString())
      .amove(x + lenght / 2 + takeOutText, y + indent - b + delta + moveText)
      .attr(text_attr)
      .attr({
        fill: color,
        stroke: color,
        "stroke-width": "0.05mm",
        "font-size": size,
      });
    return symbol.rotate(rotate, x, y);
  }

  /**
   * designation of diameter dimensions on the plan
   * @param {number} x coordinate x1
   * @param {number} y coordinate y1
   * @param {number} dInit indent from line
   * @param {number} vx shift of designation along x
   * @param {number} vy shift of designation along y
   * @param {scale} scale
   * @returns {object}
   */
  dimCircle(x, y, dInit, vx = 7, vy = -7, scale = 1) {
    x = mm(x);
    y = mm(y);
    let d = mm(Math.abs(dInit));
    vx = mm(vx);
    vy = mm(vy);
    let size = mm(3.5) * scale;
    let a = mm(4) * scale;
    let color = "purple";
    var group0 = this.draw.group();
    var group = this.draw.group();
    group
      .line(x - d / 2 - a, y, x + d / 2 + a, y)
      .attr(attr_bolt)
      .attr({ stroke: color });
    let arrow = this.draw
      .path(`m0,0 l${mm(scale * 3)},${mm(scale * 1)} v-${mm(scale * 2)}`)
      .move(x + d / 2, y - mm(scale));
    group.add(arrow);
    group.add(
      arrow
        .clone()
        .x(x - d / 2 - 12 * scale)
        .rotate(180)
    );
    group0.add(group.rotate((Math.atan(vy / vx) * 180) / Math.PI));
    group0
      .line(x, y, x + vx, y + vy)
      .attr(attr_bolt)
      .attr({ stroke: color });
    group0.add(
      this.draw
        .line(
          x + vx,
          y + vy,
          x + vx + ((mm(6) * vx) / Math.abs(vx)) * scale,
          y + vy
        )
        .attr(attr_bolt)
        .attr({ stroke: color })
    );
    group0.add(
      this.draw
        .text("⌀" + Math.abs(dInit).toString())
        .amove(
          x + vx + ((mm(3) * vx) / Math.abs(vx)) * scale,
          y + vy - mm(5) * scale + moveText
        )
        .attr(text_dim, {
          "font-size": size,
        })
    );
    return group0;
  }

  /**
   * calculation of the coefficients of the straight line
   * y = a x + c
   * @param {object} l  l={x1, y1, x2, y2 }
   * @returns {a, c} - coefficients
   */
  directCoefficients(l) {
    let a = (l.y2 - l.y1) / (l.x2 - l.x1);
    let c = l.y2 - a * l.x1;
    return { a, c };
  }

  /**
   * @param {object} l1 l={x1, y1, x2, y2 }
   * @param {object} l2 l={x1, y1, x2, y2 }
   * @returns {number} r distance from the first point to the intersection of lines
   */
  radius(l1, l2) {
    let p1 = this.directCoefficients(l1);
    let p2 = this.directCoefficients(l2);
    let x = (p2.c - p1.c) / (p1.a - p2.a);
    let y = p1.a * x + p1.c;
    let r = ((l1.x1 - x) ** 2 + (l1.y1 - y) ** 2) ** 0.5;
    return r;
  }

  /**
   * calculates angle data
   * @param {object} l l={x1, y1, x2, y2 }
   * @param {number} indent
   * @returns {angle, x, y}
   */
  dataAngle(l, indent = 10) {
    let len = Math.sqrt((l.x2 - l.x1) ** 2 + (l.y2 - l.y1) ** 2);
    let ang =
      Math.round(((Math.asin((l.x2 - l.x1) / len) * 180) / Math.PI) * 1000) /
      1000;
    let ang2 =
      Math.round(((Math.acos((l.y2 - l.y1) / len) * 180) / Math.PI) * 1000) /
      1000;
    let x2 = l.x1 + indent * Math.sin(((ang + 180) * Math.PI) / 180);
    let y2 = l.y1 + indent * Math.cos(((ang + 180) * Math.PI) / 180);
    let angFin = 90 - ang;
    // if(ang >0 && ang2 <90)
    // III
    if (ang < 0 && ang2 < 90) {
      // IV
      angFin = ang2 + 90;
    } else if (ang > 0 && ang2 > 90) {
      // I
      angFin = -ang;
      y2 = l.y1 + mm(1) * Math.cos(((ang + 0) * Math.PI) / 180) * indent;
    } else if (ang < 0 && ang2 > 90) {
      // II
      angFin = ang - 90;
      y2 = l.y1 + mm(1) * Math.cos(((ang + 0) * Math.PI) / 180) * indent;
    }
    // draw.text(ang.toString())
    // draw.text(ang2.toString()).y(mm(10))
    // draw.text(angFin.toString()).y(mm(20))

    // draw.line(l.x1,l.y1,l.x2,l.y2).attr(attr_bolt).attr({ stroke: "green" })
    // draw.line(l.x1,l.y1,x2,y2).attr(attr_axes)
    return { ang: angFin, x: x2, y: y2 };
  }

  /**
   * constructs side-turned lines of an angular cut
   * @param {object} l l={x1, y1, x2, y2 }
   * @param {number} ang rotation angle in degrees
   * @param {number} indent indent from line
   * @param {number} scale
   * @returns {object} group
   */
  sideLines(l, ang, indent = mm(10), scale = 1) {
    let color = "purple";
    let group = this.draw.group();
    let a = mm(2) * scale;
    group
      .line(l.x1, l.y1, l.x1, l.y1 - indent - a)
      .attr(attr_bolt)
      .attr({ stroke: color });
    group
      .line(l.x1 - a, l.y1 - indent + a, l.x1 + a, l.y1 - indent - a)
      .attr(attr_bolt)
      .attr({ stroke: color, "stroke-width": "1mm" });
    return group.rotate(ang - 90, l.x1, l.y1);
  }

  /**
   * angle dimention
   * @param {object} l1 l={x1, y1, x2, y2 }
   * @param {object} l2 l={x1, y1, x2, y2 }
   * @param {number} indent indent from line
   * @param {number} scale
   */
  dimAngle(l1, l2, indent = 15, scale = 1, rotate = 0) {
    let a = mm(1);
    let color = "purple";
    indent = mm(indent);
    let d1 = this.dataAngle(l1, indent);
    let r = indent + this.radius(l1, l2);
    let d2 = this.dataAngle(l2, indent);
    let group = this.draw.group();
    rotate = rotate == 180 ? 180 : 0;
    group
      .text((d2.ang - d1.ang).toString())
      .amove((l1.x1 + l2.x1) / 2, l1.y1 - indent - a * 8+ moveText)
      .attr(text_attr)
      .attr({ fill: color })
      .rotate(rotate);
    group.add(this.sideLines(l1, d1.ang, indent, scale));
    group.add(this.sideLines(l2, d2.ang, indent, scale));
    group
      .path(`M${d1.x},${d1.y} A${r}, ${r} 0 0,1 ${d2.x},${d2.y}`)
      .attr(attr_bolt)
      .attr({ stroke: color });
    return group;
  }

  /**
   * drawing a circle
   * @param {number} x coordinate x first point mm
   * @param {number} y coordinate y first point mm
   * @param {number} d diametr first line mm
   * @param {number} d2 diametr second line mm
   * @param {boolean} dim view dimentions
   * @param {number} scale
   * @returns
   */
  circle(x, y, d, d2 = 0, dim = true, scale = 1) {
    var group = this.draw.group();
    group
      .ellipse(mm(x * 2), mm(y * 2))
      .radius(mm(d / 2), mm(d / 2))
      .attr(attr_bolt);
    let sec_attr = d2 > 0 ? attr_bolt : attr_dotted;
    let d1 = d;
    d = d2 != 0 ? Math.abs(d2) : d;
    group
      .ellipse(mm(x * 2), mm(y * 2))
      .radius(mm(d / 2), mm(d / 2))
      .attr(sec_attr);
    let l = group
      .line(mm(x - d / 2 - 3), mm(y), mm(x + d / 2 + 3), mm(y), mm(d))
      .attr(attr_axes);
    group.use(l).rotate(90);
    if (dim) {
      group.add(this.dimCircle(x, y, d1, 7, -7, scale));
      if (d2 != 0) {
        group.add(this.dimCircle(x, y, d2, 7, 7, scale));
      }
    }
    return group;
  }

  /**
   * hole in the cut
   * @param {number} x - coordinate x mm
   * @param {number} y - coordinate y mm
   * @param {number} d1 - first diametr mm
   * @param {number} d2 - second diametr mm
   * @param {number} h - hole depth mm
   * @param {number} scale - hole depth mm
   */
  hole(x, y, d1, d2, h, scale = 1, rotate = 0) {
    [x, y, d1, d2, h] = [x, y, d1, d2, h].map(mm);
    let group = this.draw.group();
    group
      .path(`m${x - d1 / 2},${y} h${d1}, l-${(d1 - d2) / 2},${h} h-${d2} z`)
      .attr(attr_bolt)
      .fill("white");
    group
      .add(
        this.draw
          .line(x, y - mm(1) * scale, x, y + h + mm(1) * scale)
          .attr(attr_axes)
      )
      .attr({ "stroke-width": "0.3mm", stroke: "black" });
    return group.rotate(rotate);
  }

  dimHole(x, y, d1, d2, h, scale = 1, rotate = 0) {
    let l1 = {
      x1: mm(x - d1 / 2),
      y1: mm(y),
      x2: mm(x - d2 / 2),
      y2: mm(y + h),
    };
    let l2 = {
      x1: mm(x + d1 / 2),
      y1: mm(y),
      x2: mm(x + d2 / 2),
      y2: mm(y + h),
    };
    this.dimAngle(l1, l2, 7, 1, rotate).rotate(rotate, mm(x), mm(y + h / 2));
    this.hole(x, y, d1, d2, h, scale, rotate);
  }

  /**
   * section designation
   * @param {text} name name section
   * @param {number} x coordinate x mm start point
   * @param {number} y coordinate y mm start point
   * @param {number} l lenght section mm
   * @param {number} rotate rotate section in degres
   * @param {number} scale
   * @returns {group}
   */
  simbolSection(name, x, y, l, rotate = 0, scale = 1) {
    let l1 = mm(10) * scale,
      p1 = mm(7) * scale,
      ph1 = mm(4) * scale,
      pl1 = mm(2) * scale,
      ph2 = mm(10) * scale,
      size = mm(3.5) * scale,
      attrSimbol = {
        stroke: "purple",
        "stroke-width": "0.2mm",
        fill: "purple",
      },
      attrSimbolText = {
        stroke: "black",
        "stroke-width": "0.1mm",
        "font-size": size,
        "text-anchor": "middle",
      };
    [x, y, l] = [x, y, l].map(mm);
    let group = this.draw.group();
    let line1 = this.draw.line(x - l1, y, x, y).attr(attr_line_thick);
    group.add(line1);
    group.add(line1.clone().x(x + l));
    let arrow = this.draw
      .path(`M${x - p1},${y} l${pl1 / 2},${ph1} h${-pl1} z v${ph2}`)
      .attr(attrSimbol);
    group.add(arrow);
    group.add(arrow.clone().x(x + l + p1 - pl1 / 2));
    group
      .text(name)
      .attr(attrSimbolText)
      .amove(x - l1, y + pl1 * 2);
    group
      .text(name)
      .attr(attrSimbolText)
      .amove(x + l1 + l, y + pl1 * 2);
    return group.rotate(rotate, x, y);
  }

  /**
   * table of detail KMD
   * @param {number, section, lenght:, count, weightOne, weightAll, stell, comment} listLine one line of list
   * @param {number} x coordinate x mm
   * @param {number} y coordinate y mm
   */
  tableDetail(x = 20, y = 214, listLine = tableKMD) {
    [x, y] = [x, y].map(mm);
    let dx = x;
    let group = this.draw.group();
    group.line(x, y, x + mm(185), y).attr(attr_bolt);
    group
      .line(x + mm(105), y + mm(7.5), x + mm(140), y + mm(7.5))
      .attr(attr_bolt);
    group
      .line(x + mm(120), y + mm(7.5), x + mm(120), y + mm(15))
      .attr(attr_bolt);
    let h = [0, 15, 55, 20, 15, 35, 20, 25].map(mm);
    for (const i of h) {
      dx = dx + i;
      group.line(dx, y, dx, y + mm(15)).attr(attr_bolt);
    }
    group.text("N \nдеталі").move(x + mm(7), y + mm(3));
    group.text("Переріз").move(x + mm(45), y + mm(5.5));
    group.text("Довжина \nмм").move(x + mm(80), y + mm(3));
    group.text("Кількість \nшт").move(x + mm(98), y + mm(3));
    group.text("Масса кг").move(x + mm(122), y + mm(1));
    group.text("1 елем").move(x + mm(112), y + mm(9));
    group.text("всіх").move(x + mm(130), y + mm(7));
    group.text("елементів").move(x + mm(130), y + mm(10));
    group
      .text("Найменування \nабо марка \nметалу")
      .move(x + mm(150), y + mm(2))
      .attr({ "font-size": "3mm" });
    group.text("Примітка").move(x + mm(172), y + mm(5.5));
    // line
    let lenght = listLine.length >= 1 ? listLine.length : 1;
    let dx2 = x;
    let h1 = [0, 15, 55, 20, 15, 15, 20, 20, 25].map(mm);
    for (const i of h1) {
      dx2 = dx2 + i;
      group.line(dx2, y + mm(15), dx2, y + mm(15 + 8 * lenght)).attr(attr_bolt);
    }
    for (let i = 0; i <= lenght; i++) {
      group
        .line(x, y + mm(15) + mm(8) * i, x + mm(185), y + mm(15) + mm(8) * i)
        .attr(attr_bolt);
    }
    for (let i = 0; i < lenght; i++) {
      let row = listLine[i];
      group.text(row.number.toString()).move(x + mm(7), y + mm(17) + mm(8) * i);
      group
        .text(row.section.toString())
        .move(x + mm(45), y + mm(17) + mm(8) * i);
      group
        .text(row.lenght.toString())
        .move(x + mm(80), y + mm(17) + mm(8) * i);
      group.text(row.count.toString()).move(x + mm(98), y + mm(17) + mm(8) * i);
      group
        .text(row.weightOne.toString())
        .move(x + mm(112), y + mm(17) + mm(8) * i);
      group
        .text(row.weightAll.toString())
        .move(x + mm(130), y + mm(17) + mm(8) * i);
      group
        .text(row.stell.toString())
        .move(x + mm(150), y + mm(17) + mm(8) * i);
      group
        .text(row.comment.toString())
        .move(x + mm(172), y + mm(17) + mm(8) * i);
    }
    group.attr(text_attr);
  }

  /**
   * stamp and drawing frame A4
   * @param {text} name1 inspector
   * @param {text} name2 developer
   * @param {text} data "08.2024"
   * @param {text} cipher "23-07-0387КА"
   * @param {text} title "Большая арнаутская 87"
   * @param {text} description
   */
  stampA4(
    description = "detail",
    name1 = "Крыжный",
    name2 = "Ивашкевич",
    data = "08.2024",
    cipher = "23-07-0387КА",
    title = "Большая арнаутская 87"
  ) {
    this.draw.rect("185mm", "232mm").attr(attr_bolt).move("20mm", "5mm");
    this.draw.rect("185mm", "55mm").attr(attr_bolt).move("20mm", "237mm");
    let l1 = this.draw.line("20mm", "247mm", "205mm", "247mm").attr(attr_bolt);
    this.draw.use(l1).move("0", "15mm");
    this.draw.use(l1).move("0", "30mm");
    let l2 = this.draw.line("20mm", "242mm", "85mm", "242mm").attr(attr_bolt);
    this.draw.use(l2).move("0", "10mm");
    this.draw.use(l2).move("0", "15mm");
    this.draw.use(l2).move("0", "25mm");
    this.draw.use(l2).move("0", "30mm");
    this.draw.use(l2).move("0", "40mm");
    this.draw.use(l2).move("0", "45mm");
    let l3 = this.draw.line("85mm", "237mm", "85mm", "292mm").attr(attr_bolt);
    this.draw.use(l3).move("-10mm", "0mm");
    this.draw.use(l3).move("-25mm", "0mm");
    this.draw.use(l3).move("-48mm", "0mm");
    let l4 = this.draw.line("27mm", "237mm", "27mm", "262mm").attr(attr_bolt);
    this.draw.use(l4).move("20mm", "0mm");
    let l5 = this.draw.line("155mm", "262mm", "155mm", "277mm").attr(attr_bolt);
    this.draw.use(l5).move("15mm", "0mm");
    this.draw.use(l5).move("30mm", "0mm");
    this.draw.use(l5).move("0mm", "15mm");
    this.draw.line("155mm", "267mm", "205mm", "267mm").attr(attr_bolt);
    this.draw.text("Зм.").attr(text_attr).amove("24mm", "261mm");
    this.draw.text("Кільк").attr(text_attr).amove("32mm", "261mm");
    this.draw.text("Арк.").attr(text_attr).amove("42mm", "261mm");
    this.draw.text("№ док.").attr(text_attr).amove("54mm", "261mm");
    this.draw.text("Підпис").attr(text_attr).amove("67mm", "261mm");
    this.draw.text("Дата").attr(text_attr).amove("80mm", "261mm");
    this.draw.text("Розробив.").attr(text_attr).amove("29mm", "266mm");
    this.draw.text("Перевірив.").amove("29mm", "270mm").attr(text_attr).font({
      size: "0.75em",
    });
    this.draw.text("T. Контр.").attr(text_attr).amove("29mm", "275mm");
    this.draw.text("Н. Контр.").attr(text_attr).amove("29mm", "281mm");
    this.draw.text("Затвердив.").attr(text_attr).amove("29mm", "291mm").font({
      size: "0.72em",
    });
    this.draw.text("Стадия").attr(text_attr).amove("162mm", mm(266));
    this.draw.text("Аркуш").attr(text_attr).amove("177mm", mm(266));
    this.draw.text("Аркушів").attr(text_attr).amove("195mm", mm(266));
    this.draw.text("Р").attr(text_attr).amove("162mm", mm(273)).font({
      size: "4.5mm",
    });
    this.draw.text("1").attr(text_attr).amove("177mm", mm(273)).font({
      size: "4.5mm",
    });
    this.draw.text(name1).attr(text_attr).amove("49mm", "266mm");
    this.draw.text(name2).attr(text_attr).amove("49mm", "270mm");
    let t1 = this.draw.text(data).attr(text_attr).amove("80mm", mm(266)).font({
      size: "2.5mm",
    });
    this.draw.use(t1).move("0mm", "5mm");
    this.draw.text(cipher).attr(text_attr).amove("143mm",mm(242)).font({
      size: "4.5mm",
    });
    this.draw.text(title).attr(text_attr).amove("143mm", mm(255)).font({
      size: "4.5mm",
    });
    this.draw
      .text("Задание в ЦАК")
      .attr(text_attr)
      .amove("122mm", mm(270))
      .font({
        size: "4.5mm",
      });
    this.draw.text(description).attr(text_attr).amove("122mm", mm(285));
  }
}

/**
 * general class of detail
 */
class Deatil extends Base {
  x = 20;
  constructor(
    draw,
    x,
    y,
    z = 2,
    name,
    section = "-2",
    material = "AISI201",
    count = 1,
    view = 1
  ) {
    super(draw);
    this.x = x;
    this.y = y;
    this.z = z;
    this.name = name;
    this.section = section;
    this.material = material;
    this.sx = 30;
    this.sy = 20;
    this.v = view;
    this.count = count;
    this.addDetailInSpec();
    // this.view(0)
    // return this.view(0)
    return this;
  }

  addDetailInSpec() {
    this.weightOne =
      Math.round(this.x * this.y * this.z * 7850 / 10 ** 6) / 1000;
    details.push({
      number: "0",
      name: this.name,
      section: this.section + "x" + this.y,
      lenght: this.x,
      material: this.material,
      weightOne: this.weightOne,
    });
    tableKMD.push({
      number: this.name,
      section: "-" + this.z + "x" + this.y,
      lenght: this.x,
      count: this.count,
      weightOne: this.weightOne,
      weightAll: Math.round(this.weightOne * this.count * 100) / 100,
      stell: this.material,
      comment: "",
    });
  }

  viewDetail() {
    let x = this.x;
    let y = this.y;
    if (this.view == "2") {
      y = this.z;
    }
    let group = this.draw.group();
    group
      .text("Деталь " + this.name)
      .amove(mm(x / 2 + this.sx), mm(this.sy - 7))
      .attr(text_attr);
    group.add(
      this.draw
        .rect(mm(x), mm(y))
        .attr(attr_bolt)
        .move(mm(this.sx), mm(this.sy))
    );
    return group;
  }

  view() {
    let group = this.draw.group();
    group.rect(10, 10).fill("none");
    group.add(this.viewDetail());
    if (this.v) {
      group.add(this.dimention(this.sx, this.sy + this.y, this.x, 0, 25));
      group.add(
        this.dimention(this.sx + this.x, this.sy + this.y, this.y, -90, 25)
      );
    }
    return group;
  }
}
