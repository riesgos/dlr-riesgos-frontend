export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Vector = number[];
export type V2Matrix = Vec2[];
export type V3Matrix = Vec3[];
export type V4Matrix = Vec4[];
export type Matrix = number[][];


export function first<T>(arr: T[], condition: (el: T) => boolean): T | null {
    for (const el of arr) {
        if (condition(el)) {
            return el;
        }
    }
    return null;
}

/** ------------------------------------------------------------ /
 *       Powers
 * -------------------------------------------------------------*/

export const logN = (val: number, root: number): number => {
    return Math.log(val) / Math.log(root);
};

export const isPowerOf = (val: number, root: number): boolean => {
    return logN(val, root) % 1 === 0;
};

export const nextPowerOf = (val: number, root: number): number => {
    const exponent = Math.ceil(logN(val, root));
    return Math.pow(2, exponent);
};



/** ------------------------------------------------------------ /
 *       Vectors
 * -------------------------------------------------------------*/


export const binaryVectorOp = (vec0: Vector, vec1: Vector, operation: (a: number, b: number) => number): Vector => {
    if (vec0.length !== vec1.length) {
        throw new Error('Vectors are not of the same length');
    }
    const newVec = [];
    for (let i = 0; i < vec0.length; i++) {
        newVec.push(operation(vec0[i], vec1[i]));
    }
    return newVec;
};

export const vectorAddition = (vec0: Vector, vec1: Vector): Vector => {
    return binaryVectorOp(vec0, vec1, (a, b) => a + b);
};

export const vectorSubtraction = (vec0: Vector, vec1: Vector): Vector => {
    return binaryVectorOp(vec0, vec1, (a, b) => a - b);
};

export const pointWiseVectorMultiplication = (vec0: Vector, vec1: Vector): Vector => {
    return binaryVectorOp(vec0, vec1, (a, b) => a * b);
};

export const scalarProduct = (scalar: number, vector: Vector): Vector => {
    return vector.map(el => scalar * el);
};

export const vectorLength = (vec: Vector): number => {
    const sq = vec.reduce((prevVal: number, currVal: number) => prevVal + currVal * currVal, 0);
    return Math.sqrt(sq);
};

export const vectorSum = (vec: Vector): number => {
    return vec.reduce((prev: number, val: number) => prev + val, 0);
};

export const pointDistance = (p0: Vector, p1: Vector): number => {
    const diff = vectorSubtraction(p0, p1);
    const size = vectorLength(diff);
    return size;
};



export const flatten2 = (m: number[][]): number[] => {
    const nrRows = m.length;
    const nrCols = m[0].length;
    const out = Array(nrRows * nrCols);
    let i = 0;
    for (let r = 0; r < nrRows; r++) {
        for (let c = 0; c < nrCols; c++) {
            out[i] = m[r][c];
            i++;
        }
    }
    return out;
};

export const flatten3 = (m: number[][][]): number[] => {
    const nrRows = m.length;
    const nrCols = m[0].length;
    const nrEls = m[0][0].length;
    const out = Array(nrRows * nrCols * nrEls);
    let i = 0;
    for (let r = 0; r < nrRows; r++) {
        for (let c = 0; c < nrCols; c++) {
            for (let e = 0; e < nrEls; e++) {
                out[i] = m[r][c][e];
                i++;
            }
        }
    }
    return out;
};

export const flatten4 = (m: number[][][][]): number[] => {
    const nrMatrices = m.length;
    const nrRows = m[0].length;
    const nrCols = m[0][0].length;
    const nrEls = m[0][0][0].length;
    const out = Array(nrMatrices * nrRows * nrCols * nrEls);
    let i = 0;
    for (let n = 0; n < nrMatrices; n++) {
        for (let r = 0; r < nrRows; r++) {
            for (let c = 0; c < nrCols; c++) {
                for (let e = 0; e < nrEls; e++) {
                    out[i] = m[n][r][c][e];
                    i++;
                }
            }
        }
    }
    return out;
};


/** ------------------------------------------------------------ /
 *       Matrices
 * -------------------------------------------------------------*/

export const createMatrix = (nrRows: number, nrCols: number): number[][] => {
    const m = [];
    for (let r = 0; r < nrRows; r++) {
        m.push([]);
        for (let c = 0; c < nrCols; c++) {
            m[r].push(0);
        }
    }
    return m;
};


export const matrixMultiply = (mat1: number[][], mat2: number[][]): number[][] => {
    const nrRows1 = mat1.length;
    const nrCols1 = mat1[0].length;
    const nrRows2 = mat2.length;
    const nrCols2 = mat2[0].length;
    const m = createMatrix(nrRows1, nrCols2);
    for (let r = 0; r < nrRows1; ++r) {
        for (let c = 0; c < nrCols2; ++c) {
            m[r][c] = 0;
            for (var i = 0; i < nrCols1; ++i) {
                m[r][c] += mat1[r][i] * mat2[i][c];
            }
        }
    }
    return m;
};

export const matrixMultiplyList = (matrices: number[][][]): number[][] => {
    const nrMatrices = matrices.length;
    let m = matrices[nrMatrices - 1];
    for (let i = nrMatrices - 2; i >= 0; i--) {
        m = matrixMultiply(matrices[i], m);
    }
    return m;
};

export const matrixAddition = (mat1: number[][], mat2: number[][]): number[][] => {
    const nrRows = mat1.length;
    const nrCols = mat1[0].length;
    const m = createMatrix(nrRows, nrCols);
    for (let r = 0; r < nrRows; ++r) {
        for (let c = 0; c < nrCols; ++c) {
            m[r][c] = mat1[r][c] + mat2[r][c];
        }
    }
    return m;
};

export const transposeMatrix = (mat: number[][]): number[][] => {
    const nrRows = mat.length;
    const nrCols = mat[0].length;
    const matT = createMatrix(nrCols, nrRows);
    for (let r = 0; r < nrRows; r++) {
        for (let c = 0; c < nrCols; c++) {
            matT[c][r] = mat[r][c];
        }
    }
    return matT;
};


export const matrixSum = (m: Matrix): number => {
    let sum = 0.;
    for (const row of m) {
        for (const entry of row) {
            sum += entry;
        }
    }
    return sum;
};

export const matrixVectorProduct = (m: Matrix, v: Vector): Vector => {
    const out = [];
    for (const row of m) {
        const s = vectorSum(pointWiseVectorMultiplication(row, v));
        out.push(s);
    }
    return out;
};


/** ------------------------------------------------------------ /
 *       Homogeneous coordinates
 * -------------------------------------------------------------*/


export const cartesian2Homogeneous = (arr: number[]): number[] => {
    return [arr[0], arr[1], arr[2], 1];
};

export const homogeneous2Cartesian = (arr: number[]): number[] => {
    return [arr[0] / arr[3], arr[1] / arr[3], arr[2] / arr[3]];
};

export const scaleMatrix = (sx: number, sy: number, sz: number): number[][] => {
    return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ];
};

export const identityMatrix = (): number[][] => {
    return scaleMatrix(1, 1, 1);
};

export const translateMatrix = (tx: number, ty: number, tz: number): number[][] => {
    return [
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ];
};

export const projectionMatrix = (fieldOfViewInRadians: number, aspectRatio: number, near: number, far: number): number[][] => {
    var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
    var rangeInv = 1 / (near - far);

    return [
        [f / aspectRatio, 0,                          0,   0                       ],
        [0,               f,                          0,   0                       ],
        [0,               0,    (near + far) * rangeInv,  near * far * rangeInv * 2],
        [0,               0,                         -1,   0                       ]
      ];
};

export const rotateXMatrix = (rad: number): number[][] => {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(rad), -Math.sin(rad), 0],
        [0, Math.sin(rad), Math.cos(rad), 0],
        [0, 0, 0, 1],
    ];
};

export const rotateYMatrix = (rad: number): number[][] => {
    return [
        [Math.cos(rad), 0, Math.sin(rad), 0],
        [0, 1, 0, 0],
        [-Math.sin(rad), 0, Math.cos(rad), 0],
        [0, 0, 0, 1],
    ];
};

export const rotateZMatrix = (rad: number): number[][] => {
    return [
        [Math.cos(rad), -Math.sin(rad), 0, 0],
        [Math.sin(rad), Math.cos(rad), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
};
