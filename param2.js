function plate(
  draw,
  b,
  developer,
  inspector,
  cipher,
  address,
  name,
  material,
  Width,
  left,
  right,
  height,
  up,
  down,
  diametr,
  thickness,
  count
) {
  let A4 = { b: 210 - 25, h: 297 - 10 - 65 };

  let nameDetail = name,
    y = 20,
    lx = Width,
    ly = height,
    dx = left,
    dy = down,
    d = diametr,
    h = thickness,
    d2 = d + h * 2;
  let x = (A4.b - lx + 25) / 2;
  let det1 = new Deatil(draw, lx, ly, h, nameDetail, "-2", material, count);
  det1.view().move(mm(x - 30), mm(y - 20));
  b.circle(x + dx, y + up, d, -d2);
  b.circle(x + lx - right, y + up, d, d2);
  b.circle(x + dx, y + ly - down, d, -d2);
  b.circle(x + lx - right, y + ly - dy, d, d2);
  b.dimention(x, y + ly - dy + d2 / 2, dx, 0, dy + 10);
  b.dimention(x + lx - right, y + ly - dy + d2 / 2, right, 0, dy + 10);
  b.dimention(x + lx - dy + d2 / 2, y + ly, dy, -90, dy + 10);
  b.dimention(x + lx - dy + d2 / 2, y + up, up, -90, dy + 10);
  b.simbolSection("a", x - 3, y + up, lx + 6);

  let nameView = "a-a",
    v2dy = 50;
  draw
    .text(nameView)
    .amove(mm(x + lx / 2), mm(y + ly + v2dy - 20))
    .attr(text_attr);
  draw
    .rect(mm(lx), mm(h))
    .attr(attr_bolt)
    .move(mm(x), mm(y + ly + v2dy))
    .fill(b.line45);

  b.dimHole(x + dx, y + ly + v2dy, d2, d, h, 1, 180);
  b.dimHole(x + lx - right, y + ly + v2dy, d2, d, h, 1, 0);
  b.dimention(x, y + ly + v2dy, lx, 0, 30);
  b.dimention(x, y + ly + v2dy, h, 90);
  b.dimention(x, y + ly + v2dy, dx, 0, 20);
  b.dimention(x + lx - right, y + ly + v2dy, right, 0, 20);

  b.tableDetail();
  b.stampA4(
    "Деталь " + nameDetail,
    developer,
    inspector,
    "08.2024",
    cipher,
    address
  );
  return draw;
}
