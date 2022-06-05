function linearInterpolation(_left, _right, number) {
    return _left + (_right - _left) * number
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y)


    if (bottom === 0) {
        return null
    }

    const t = tTop / bottom
    const u = uTop / bottom

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: linearInterpolation(A.x, B.x, t),
            y: linearInterpolation(A.y, B.y, t),
            offset: t
        }
    }


    return null;
}

function polysIntersect(polygon1, polygon2) {
    const touches = polygon1.flatMap((pt1, i) =>
        polygon2.map((pt2, j) =>
            getIntersection(
                pt1,
                polygon1[(i + 1) % polygon1.length],
                pt2,
                polygon2[(j + 1) % polygon2.length]
            )))
    return touches.some(touch => touch);
}

