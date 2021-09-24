/**
 * WEBGL
 *
 * A rasterization engine that allows to draw points, line segments, or triangles.
 *
 * Vertex shaders take whatever coordinates you use and return a 3-d array with elements between -1 and 1.
 * Basically, this is a 3d-array, but WebGl does not use the z-axis for real perspective, but only to differentiate
 * what pixel lies in front of another.
 * This is not like looking in a 3d-box, but rather like looking on multiple stacked sheets on a projector.
 * Actually, this is a lie. WebGl uses 4 coordinates: x, y, z and w. The above only holds if you keep w at 1.
 * After applying the vertex shader, WebGl divides all coordinates by w, yielding (x/w, y/w, z/w, 1).
 * This can be used to calculate projections - google for 'homogeneous coordinates' to find out more.
 * Compare this [site](https://www.tomdalling.com/blog/modern-opengl/explaining-homogenous-coordinates-and-projective-geometry/)
 * and the shader `basic3d.vert.glsl`.
 *
 * WebGL knows two data structures:
 *  - buffers (generic byte arrays): usually positions, normals, texture-coordinates, vertex-colors etc.
 *    buffers are accessed in shaders as 'attributes'.
 *    note that buffers contain one entry for each vertex.
 *  - textures (bitmap images).
 *
 * Shaders use these data structures in two different ways.
 *  - Attributes are values, one per vertex.
 *    For the shader, attributes are read-only.
 *    Attributes default to [0, 0, 0, 1]
 *  - Uniforms are values, one per shader.
 *    For the shader, uniforms are read-only.
 *
 * Apart from this, shaders know about two more types of data:
 *  - Varyings are values that are passed from vertex-shader to fragment-shader.
 *    They are read-only only for the fragment-shader.
 *  - Const: a compile-time constant.
 *
 * A program is just a list of compiled and linked vertex- and fragment-shaders.
 *
 *
 * Drawing: there's drawArrays and drawElements.
 *  - drawArrays is the robust all-rounder.
 *  - drawElements can be more performant if you share vertices between objects.
 *
 *
 * Rendering data is fast, but uploading it into GPU memory is slow.
 * Optimizing WebGl performance mostly means: Avoiding having GPU and CPU wait for each other.
 * The more the GPU can do in bulk, the better. The more often you have to upload data from CPU to GPU, the worse.
 *  - So avoid switching programs, buffers and uniforms if you can.
 *    (You won't be able to avoid switching buffers, because every object is likely different. But sort your objects by their shaders, and you'll save a lot of time.)
 *  - Try to do translations, rotations and shears inside the vertex-shader instead of altering the object's buffer.
 *  - If appropriate, create über-shaders and über-buffers, that contain information for more than just one object.
 *
 * There is another thing that affects performance:
 * WebGL will only run fragment-shaders when the object's pixels aren't already obscured by a larger object in front of it.
 * That means it makes sense to first draw large objects that are close to the camera - all objects behind them won't need their fragment-shader executed.
 *
 * All `create*` functions unbind variables after setting their values. This is to avoid unwanted side-effects.
 *
 *
 *
 * WebGL components
 *    - global-state
 *        - ARRAY_BUFFER_BINDING: currently bound buffer
 *        - VERTEX_ARRAY_BINDING: currently bound vertex-array (in WebGL 1 this was always only the global vertex-array, in WebGL 2 you can now create your own ones)
 *        - ACTIVE_TEXTURE: currently bound texture
 *        - texture-units: a list of pointers to texture-buffers.
 *        - uniform-buffer-bindings (WebGL2 only): a list of pointers to uniform-buffers.
 *    - vertex-array: a list of pointers to attribute-buffers (+ metadata like datatype, stride, offset etc.).
 *        - all attributes must have the same number of elements (though one attribute's elements may be vec2's, while another one's may be vec3's)
 *        - drawArray: attributes repeat elements in groups of three for drawing triangles
 *        - drawElements: the indices for the triangles are defined in ELEMENT_ARRAY_BUFFER_BINDING
 *        - WebGL 2.0: allows you to create your own vertex-arrays, whereas 1.0 always only used one global vertex-array.
 */

import { isPowerOf, flatten3 } from './math';




export type GlDrawingMode = 'triangles' | 'points' | 'lines';

export type WebGLUniformType  = 'bool'  | 'bvec2' | 'bvec3' | 'bvec4'| 'bool[]'  | 'bvec2[]' | 'bvec3[]' | 'bvec4[]'
                              | 'int'   | 'ivec2' | 'ivec3' | 'ivec4'| 'int[]'   | 'ivec2[]' | 'ivec3[]' | 'ivec4[]'
                              | 'float' | 'vec2'  | 'vec3'  | 'vec4' | 'float[]' | 'vec2[]'  | 'vec3[]'  | 'vec4[]'
                                        | 'mat2'  | 'mat3'  | 'mat4';

export type WebGLAttributeType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4';

const shaderInputTextureBindPoint = 0;
const textureConstructionBindPoint = 7;




/**
 * Compile shader.
 */
export const compileShader = (gl: WebGL2RenderingContext, typeBit: number, shaderSource: string): WebGLShader => {
    const shader = gl.createShader(typeBit);
    if (!shader) {
        throw new Error('No shader was created');
    }
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error(`An error occurred compiling the shader: ${gl.getShaderInfoLog(shader)}.    \n\n Shader code: ${shaderSource}`);
    }
    return shader;
};


/**
 * Note that every program *must* have one and only one vertex-shader
 * and one and only one fragment shader.
 * That means you cannot add multiple fragment-shaders in one program. Instead, either load them in consecutively as part of different programs,
 * or generate an über-shader that contains both codes.
 */
export const createShaderProgram = (gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram => {

    const program = gl.createProgram();
    if (!program) {
        throw new Error('No program was created');
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
    }

    return program;
};


/**
 * Important: the blend-equation has an effect on data-textures.
 * If you have a pixel with values [125, 42, 255, 0], this pixel might get blended in the background,
 * causing you to lose that data in the rgb channels of the pixel.
 *
 * Auszug aus Chat mit Kollegen:
 * [16:21, 4.11.2020] Michael: Ich hab das Problem gefunden
 * [16:22, 4.11.2020] Michael: Sagen wir ich habe ein Objekt mit id 781
 * [16:22, 4.11.2020] Michael: In base 256 ist das
 * [16:22, 4.11.2020] Michael: (16, 3, 0, 0)
 * [16:23, 4.11.2020] Michael: Diese Daten habe ich als Pixelwert in meiner Textur gespeichert, als rgba
 * [16:23, 4.11.2020] Michael: Mit anderen Worten: a = 0
 * [16:24, 4.11.2020] Michael: Außerdem aber war die gl_blendEquation(gl_FuncAdd) gesetzt
 * [16:24, 4.11.2020] Michael: Das bedeutet, Pixel mit Transparenz werden mit dem Hintergrund verblendet
 * [16:24, 4.11.2020] Michael: Dadurch wurden meine Daten mit dem Hintergrund verwaschen, und dadurch haben sich meine ids geändert
 * [16:25, 4.11.2020] Michael: Das Problem war stärker bei niedrigen ids, weil da die opazität besonders gering war
 * [16:25, 4.11.2020] Michael: Hah!
 */
export const setup3dScene = (gl: WebGL2RenderingContext): void => {
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // allowing depth-testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.cullFace(gl.BACK);

    // allowing for transparent objects
    gl.enable(gl.BLEND);
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    clearBackground(gl, [0, 0, 0, 1]);
};

export const updateViewPort = (gl: WebGL2RenderingContext, x0: number, y0: number, x1: number, y1: number): void => {
    gl.viewport(x0, y0, x1, y1);
};


export const bindProgram = (gl: WebGL2RenderingContext, program: WebGLProgram): void => {
    gl.useProgram(program);
};


export const clearBackground = (gl: WebGL2RenderingContext, color: number[]): void => {
    gl.clearColor(color[0], color[1], color[2], color[3]);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


 /**
  * A generic buffer, together with it's metadata.
  *
  * Really, a buffer is only a array, with no information about count, length, stride, offset etc.
  * It is up to the vertex-array to interpret the buffer as having any of these properties.
  * However, in reality we rarely have a case where two vertex-array entries interpret the same buffer in different ways.
  * So we store the dimensions of a buffer together with the buffer here, so that it can be
  * consistently interpreted everywhere.
  */
export interface BufferObject {
    buffer: WebGLBuffer;
    dataPointType: number;
    staticOrDynamicDraw: number;
    attributeType: WebGLAttributeType;
}


/**
 * Create buffer. Creation is slow! Do *before* render loop.
 */
export const createBuffer = (gl: WebGL2RenderingContext, datatype: WebGLAttributeType, data: number[], changesOften = false): BufferObject => {

    const dataFlattened = new Float32Array(data);

    const buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error('No buffer was created');
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, dataFlattened, changesOften ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  // unbinding

    const bufferObject: BufferObject = {
        buffer: buffer,
        dataPointType: gl.FLOAT,   // the data is 32bit floats
        staticOrDynamicDraw: changesOften ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW,
        attributeType: datatype
    };


    return bufferObject;
};



export interface VertexArrayObject {
    buffers: BufferObject[];
    vao: WebGLVertexArrayObject;
}

export const createVertexArray = (gl: WebGL2RenderingContext): VertexArrayObject => {
    const o = gl.createVertexArray();
    return {
        buffers: [],
        vao: o
    };
};


export const drawArray = (gl: WebGL2RenderingContext, drawingMode: GlDrawingMode, vectorCount: number, offset = 0): void => {
    let glDrawingMode: number;
    switch (drawingMode) {
        case 'lines':
            glDrawingMode = gl.LINES;
            break;
        case 'points':
            glDrawingMode = gl.POINTS;
            break;
        case 'triangles':
            glDrawingMode = gl.TRIANGLES;
            break;
    }
    gl.drawArrays(glDrawingMode, offset, vectorCount);
};

export const drawArrayInstanced = (gl: WebGL2RenderingContext, drawingMode: GlDrawingMode, vectorCount: number, offset = 0, nrLoops: number): void => {
    let glDrawingMode: number;
    switch (drawingMode) {
        case 'lines':
            glDrawingMode = gl.LINES;
            break;
        case 'points':
            glDrawingMode = gl.POINTS;
            break;
        case 'triangles':
            glDrawingMode = gl.TRIANGLES;
            break;
    }
    gl.drawArraysInstanced(glDrawingMode, offset, vectorCount, nrLoops);
};


export const updateBufferData = (gl: WebGL2RenderingContext, bo: BufferObject, newData: number[]): BufferObject => {

    const dataFlattened = new Float32Array(newData);

    gl.bindBuffer(gl.ARRAY_BUFFER, bo.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, dataFlattened, bo.staticOrDynamicDraw);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  // unbinding

    const newBufferObject: BufferObject = {
        buffer: bo.buffer,
        dataPointType: gl.FLOAT,   // the data is 32bit floats
        staticOrDynamicDraw: bo.staticOrDynamicDraw,
        attributeType: bo.attributeType
    };

    return newBufferObject;
};




/**
 * Fetch attribute's location (attribute declared in some shader). Slow! Do *before* render loop.
 */
export const getAttributeLocation = (gl: WebGL2RenderingContext, program: WebGLProgram, attributeName: string): number => {
    const loc = gl.getAttribLocation(program, attributeName);
    if (loc === -1) {
        throw new Error(`Couldn't find attribute ${attributeName} in program.`);
    }
    return loc;
};



/**
 * Returns size of type in bytes.
 * type: gl.FLOAT | gl.BYTE | gl.SHORT | gl.UNSIGNED_BYTE | gl.UNSIGNED_SHORT
 */
const sizeOf = (gl: WebGL2RenderingContext, type: number): number => {
    switch (type) {
        case gl.FLOAT:
            return 4;
        case gl.BYTE:
        case gl.SHORT:
        case gl.UNSIGNED_BYTE:
        case gl.UNSIGNED_SHORT:
        default:
            throw new Error(`Unknown type ${type}`);
    }
};


/**
 * If nrInstances !== 0: binding with vertexAttribDivisor(loc, nrInstances)
 */
export const bindBufferToAttribute = (gl: WebGL2RenderingContext, attributeLocation: number, bo: BufferObject, nrInstances = 0): void => {
    // Bind buffer to global-state ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, bo.buffer);
    // Enable editing of vertex-array-location
    gl.enableVertexAttribArray(attributeLocation);

    // Bind the buffer currently at global-state ARRAY_BUFFER to a vertex-array-location.
    const byteSize = sizeOf(gl, bo.dataPointType);
    switch (bo.attributeType) {
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
         * index: A GLuint specifying the index of the vertex attribute that is to be modified.
         * size: A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
         * type: A GLenum specifying the data type of each component in the array.
         * normalized: A GLboolean specifying whether integer data values should be normalized into a certain range when being cast to a float.
         * stride: A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes. Cannot be larger than 255. If stride is 0, the attribute is assumed to be tightly packed, that is, the attributes are not interleaved but each attribute is in a separate block, and the next vertex' attribute follows immediately after the current vertex.
         * offset: A GLintptr specifying an offset in bytes of the first component in the vertex attribute array. Must be a multiple of the byte length of type.
         */
        //                             index,              size, type,             norml, stride,        offset
        case 'float':
            gl.enableVertexAttribArray(attributeLocation);
            gl.vertexAttribPointer(    attributeLocation,     1, bo.dataPointType, false, 1 * byteSize,  0               );
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            break;
        case 'vec2':
            gl.enableVertexAttribArray(attributeLocation);
            gl.vertexAttribPointer(    attributeLocation,     2, bo.dataPointType, false, 2 * byteSize,  0               );
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            break;
        case 'vec3':
            gl.enableVertexAttribArray(attributeLocation);
            gl.vertexAttribPointer(    attributeLocation,     3, bo.dataPointType, false, 3 * byteSize,  0               );
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            break;
        case 'vec4':
            gl.enableVertexAttribArray(attributeLocation);
            gl.vertexAttribPointer(    attributeLocation,     4, bo.dataPointType, false, 4 * byteSize,  0               );
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            break;
        case 'mat2':
            gl.enableVertexAttribArray(attributeLocation + 0);
            gl.vertexAttribPointer(    attributeLocation + 0, 2, bo.dataPointType, false, 4 * byteSize,  0 * 2 * byteSize);
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            gl.enableVertexAttribArray(attributeLocation + 1);
            gl.vertexAttribPointer(    attributeLocation + 1, 2, bo.dataPointType, false, 4 * byteSize,  1 * 2 * byteSize);
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation + 1, nrInstances);
            break;
        case 'mat3':
            gl.enableVertexAttribArray(attributeLocation + 0);
            gl.vertexAttribPointer(    attributeLocation + 0, 3, bo.dataPointType, false, 9 * byteSize,  0 * 3 * byteSize);
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            gl.enableVertexAttribArray(attributeLocation + 1);
            gl.vertexAttribPointer(    attributeLocation + 1, 3, bo.dataPointType, false, 9 * byteSize,  1 * 3 * byteSize);
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation + 1, nrInstances);
            gl.enableVertexAttribArray(attributeLocation + 2);
            gl.vertexAttribPointer(    attributeLocation + 2, 3, bo.dataPointType, false, 9 * byteSize,  2 * 3 * byteSize);
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation + 2, nrInstances);
            break;
        case 'mat4':
            gl.enableVertexAttribArray(attributeLocation + 0);
            gl.vertexAttribPointer(    attributeLocation + 0, 4, bo.dataPointType, false, 16 * byteSize, 0 * 4 * byteSize); // col 0
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation, nrInstances);
            gl.enableVertexAttribArray(attributeLocation + 1);
            gl.vertexAttribPointer(    attributeLocation + 1, 4, bo.dataPointType, false, 16 * byteSize, 1 * 4 * byteSize); // col 1
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation + 1, nrInstances);
            gl.enableVertexAttribArray(attributeLocation + 2);
            gl.vertexAttribPointer(    attributeLocation + 2, 4, bo.dataPointType, false, 16 * byteSize, 2 * 4 * byteSize); // col 2
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation + 2, nrInstances);
            gl.enableVertexAttribArray(attributeLocation + 3);
            gl.vertexAttribPointer(    attributeLocation + 3, 4, bo.dataPointType, false, 16 * byteSize, 3 * 4 * byteSize); // col 3
            if (nrInstances) gl.vertexAttribDivisor(attributeLocation + 3, nrInstances);
            break;
    }
};


export const bindBufferToAttributeVertexArray = (gl: WebGL2RenderingContext, attributeLocation: number, bufferObject: BufferObject, va: VertexArrayObject): VertexArrayObject => {
    gl.bindVertexArray(va.vao);
    bindBufferToAttribute(gl, attributeLocation, bufferObject);
    va.buffers.push(bufferObject);
    return va;
};


/**
 * Number of instances that will be rotated through before moving along one step of this buffer.
 * I.e. each entry in this buffer remains the same for `nrInstances` instances,
 * that is, for `nrInstances * data.length` vertices.
 */
export const bindBufferToAttributeInstanced = (gl: WebGL2RenderingContext, attributeLocation: number, bufferObject: BufferObject, nrInstances: number): void => {
    bindBufferToAttribute(gl, attributeLocation, bufferObject, nrInstances);
};


export const bindBufferToAttributeInstancedVertexArray = (gl: WebGL2RenderingContext, attributeLocation: number, bufferObject: BufferObject, nrInstances: number, va: VertexArrayObject): VertexArrayObject => {
    gl.bindVertexArray(va.vao);
    bindBufferToAttributeInstanced(gl, attributeLocation, bufferObject, nrInstances);
    va.buffers.push(bufferObject);
    return va;
};

export const bindVertexArray = (gl: WebGL2RenderingContext, va: VertexArrayObject): void => {
    gl.bindVertexArray(va.vao);
};


export interface IndexBufferObject {
    buffer: WebGLBuffer;
    count: number;
    type: number; // must be gl.UNSIGNED_SHORT
    offset: number;
    staticOrDynamicDraw: number; // gl.DYNAMIC_DRAW or gl.STATIC_DRAW
}

export const createIndexBuffer = (gl: WebGL2RenderingContext, indices: number[], changesOften = false): IndexBufferObject => {

    const indicesFlattened = new Uint32Array(indices);

    const buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error('No buffer was created');
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesFlattened, changesOften ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Back in WebGl 1, index-buffers were restricted to UShort (max allowed value inside `indicesFlattened`: 65535).
    // That was for also supporting very low-end devices.
    // Thank god we now also have UInt indices (max allowed value inside `indicesFlattened`: 4294967296).
    const bufferObject: IndexBufferObject = {
        buffer: buffer,
        count: indicesFlattened.length,
        type: gl.UNSIGNED_INT,
        offset: 0,
        staticOrDynamicDraw: changesOften ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW
    };

    return bufferObject;
};

export const bindIndexBuffer = (gl: WebGL2RenderingContext, ibo: IndexBufferObject) => {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo.buffer);
};

export const drawElements = (gl: WebGL2RenderingContext, ibo: IndexBufferObject, drawingMode: GlDrawingMode): void => {
    let glDrawingMode: number;
    switch (drawingMode) {
        case 'lines':
            glDrawingMode = gl.LINES;
            break;
        case 'points':
            glDrawingMode = gl.POINTS;
            break;
        case 'triangles':
            glDrawingMode = gl.TRIANGLES;
            break;
    }
    gl.drawElements(glDrawingMode, ibo.count, ibo.type, ibo.offset);
};

export const drawElementsInstanced = (gl: WebGL2RenderingContext, ibo: IndexBufferObject, drawingMode: GlDrawingMode, nrLoops: number): void => {
    let glDrawingMode: number;
    switch (drawingMode) {
        case 'lines':
            glDrawingMode = gl.LINES;
            break;
        case 'points':
            glDrawingMode = gl.POINTS;
            break;
        case 'triangles':
            glDrawingMode = gl.TRIANGLES;
            break;
    }
    gl.drawElementsInstanced(glDrawingMode, ibo.count, ibo.type, ibo.offset, nrLoops);
};




export interface TextureObject {
    textureType: TextureType;
    texture: WebGLTexture;
    width: number;
    height: number;
    level: number;
    internalformat: number;
    format: number;
    type: number;
    border: number;
}

export type TextureType = 'ubyte4' | 'float1' | 'float4';


/**
 * Note that float-textures are not renderable. They may be inputs, but they cannot be outputs.
 * (At least, not without extensions).
 * Table from here: https://stackoverflow.com/questions/45571488/webgl-2-readpixels-on-framebuffers-with-float-textures
 *
 *
 * | Internal Format    | Format          | Type                           | Source Bytes Per Pixel | Can be rendered to | Requires gl.NEAREST |
 * |--------------------|-----------------|--------------------------------|------------------------|--------------------|---------------------|
 * | RGBA               | RGBA            | UNSIGNED_BYTE                  | 4                      | t                  | f                   |
 * | RGB	            | RGB             | UNSIGNED_BYTE                  | 3                      | t                  | f                   |
 * | RGBA               | RGBA            | UNSIGNED_SHORT_4_4_4_4         | 2                      | t                  | f                   |
 * | RGBA               | RGBA            | UNSIGNED_SHORT_5_5_5_1	       | 2                      | t                  | f                   |
 * | RGB                | RGB             | UNSIGNED_SHORT_5_6_5           | 2                      | t                  | f                   |
 * | LUMINANCE_ALPHA    | LUMINANCE_ALPHA | UNSIGNED_BYTE	               | 2                      | t                  | f                   |
 * | LUMINANCE          | LUMINANCE       | UNSIGNED_BYTE                  | 1                      | t                  | f                   |
 * | ALPHA              | ALPHA           | UNSIGNED_BYTE                  | 1                      | t                  | f                   |
 * |--------------------|-----------------|--------------------------------|------------------------|--------------------|---------------------| 
 * | RGBA8              | RGBA            | UNSIGNED_BYTE                  | 4                      |                    |                     |
 * | RGB5_A1            |                 |                                |                        |                    |                     |
 * | RGBA4              |                 |                                |                        |                    |                     |
 * | SRGB8_ALPHA8       |                 |                                |                        |                    |                     |
 * | RGBA8_SNORM        | RGBA            | BYTE                           | 4                      |                    |                     |
 * | RGBA4              | RGBA            | UNSIGNED_SHORT_4_4_4_4         | 2                      |                    |                     |
 * | RGB5_A1            | RGBA            | UNSIGNED_SHORT_5_5_5_1         | 2                      |                    |                     |
 * | RGB10_A2           | RGBA            | UNSIGNED_INT_2_10_10_10_REV    | 4                      |                    |                     |
 * | RGB5_A1            |                 |                                |                        |                    |                     |
 * | RGBA16F            | RGBA            | HALF_FLOAT                     | 8                      |                    |                     |
 * | RGBA32F            | RGBA            | FLOAT                          | 16                     |                    |                     |
 * | RGBA16F            |                 |                                |                        |                    |                     |
 * | RGBA8UI            | RGBA_INTEGER    | UNSIGNED_BYTE                  | 4                      |                    |                     |
 * | RGBA8I             | RGBA_INTEGER    | BYTE                           | 4                      |                    |                     |
 * | RGBA16UI           | RGBA_INTEGER    | UNSIGNED_SHORT                 | 8                      |                    |                     |
 * | RGBA16I            | RGBA_INTEGER    | SHORT                          | 8                      |                    |                     |
 * | RGBA32UI           | RGBA_INTEGER    | UNSIGNED_INT                   | 16                     |                    |                     |
 * | RGBA32I            | RGBA_INTEGER    | INT                            | 16                     |                    |                     |
 * | RGB10_A2UI         | RGBA_INTEGER    | UNSIGNED_INT_2_10_10_10_REV    | 4                      |                    |                     |
 * | RGB8               | RGB             | UNSIGNED_BYTE                  | 3                      |                    |                     |
 * | RGB565             |                 |                                |                        |                    |                     |
 * | SRGB8              |                 |                                |                        |                    |                     |
 * | RGB8_SNORM         | RGB             | BYTE                           | 3                      |                    |                     |
 * | RGB565             | RGB             | UNSIGNED_SHORT_5_6_5           | 2                      |                    |                     |
 * | R11F_G11F_B10F     | RGB             | UNSIGNED_INT_10F_11F_11F_REV   | 4                      |  f                 |                     |
 * | RGB9_E5            | RGB             | UNSIGNED_INT_5_9_9_9_REV       | 4                      |  f                 |                     |
 * | RGB16F             | RGB             | HALF_FLOAT                     | 6                      |                    |                     |
 * | R11F_G11F_B10F     |                 |                                |                        |  f                 |                     |
 * | RGB9_E5            |                 |                                |                        |                    |                     |
 * | RGB32F             | RGB             | FLOAT                          | 12                     |  f                 |                     |
 * | RGB16F             |                 |                                |                        |  f                 |                     |
 * | R11F_G11F_B10F     |                 |                                |                        |                    |                     |
 * | RGB9_E5            |                 |                                |                        |                    |                     |
 * | RGB8UI             | RGB_INTEGER     | UNSIGNED_BYTE                  | 3                      |                    |                     |
 * | RGB8I              | RGB_INTEGER     | BYTE                           | 3                      |                    |                     |
 * | RGB16UI            | RGB_INTEGER     | UNSIGNED_SHORT                 | 6                      |                    |                     |
 * | RGB16I             | RGB_INTEGER     | SHORT                          | 6                      |                    |                     |
 * | RGB32UI            | RGB_INTEGER     | UNSIGNED_INT                   | 12                     |                    |                     |
 * | RGB32I             | RGB_INTEGER     | INT                            | 12                     |                    |                     |
 * | RG8                | RG              | UNSIGNED_BYTE                  | 2                      |                    |                     |
 * | RG8_SNORM          | RG              | BYTE                           | 2                      |                    |                     |
 * | RG16F              | RG              | HALF_FLOAT                     | 4                      |   f                |                     |
 * | RG32F              | RG              | FLOAT                          | 8                      |   f                |                     |
 * | RG16F              |                 |                                |                        |   f                |                     |
 * | RG8UI              | RG_INTEGER      | UNSIGNED_BYTE                  | 2                      |                    |                     |
 * | RG8I               | RG_INTEGER      | BYTE                           | 2                      |                    |                     |
 * | RG16UI             | RG_INTEGER      | UNSIGNED_SHORT                 | 4                      |                    |                     |
 * | RG16I              | RG_INTEGER      | SHORT                          | 4                      |                    |                     |
 * | RG32UI             | RG_INTEGER      | UNSIGNED_INT                   | 8                      |                    |                     |
 * | RG32I              | RG_INTEGER      | INT                            | 8                      |                    |                     |
 * | R8                 | RED             | UNSIGNED_BYTE                  | 1                      |                    |                     |
 * | R8_SNORM           | RED             | BYTE                           | 1                      |                    |                     |
 * | R16F               | RED             | HALF_FLOAT                     | 2                      |                    |                     |
 * | R32F               | RED             | FLOAT                          | 4                      |                    |                     |
 * | R16F               |                 |                                |                        |                    |                     |
 * | R8UI               | RED_INTEGER     | UNSIGNED_BYTE                  | 1                      |                    |                     |
 * | R8I                | RED_INTEGER     | BYTE                           | 1                      |                    |                     |
 * | R16UI              | RED_INTEGER     | UNSIGNED_SHORT                 | 2                      |                    |                     |
 * | R16I               | RED_INTEGER     | SHORT                          | 2                      |                    |                     |
 * | R32UI              | RED_INTEGER     | UNSIGNED_INT                   | 4                      |                    |                     |
 * | R32I               | RED_INTEGER     | INT                            | 4                      |                    |                     |
 * | DEPTH_COMPONENT16  | DEPTH_COMPONENT | UNSIGNED_SHORT                 | 2                      |                    |                     |
 * | DEPTH_COMPONENT24  | DEPTH_COMPONENT | UNSIGNED_INT                   | 4                      |                    |                     |
 * | DEPTH_COMPONENT16  |                 |                                |                        |                    |                     |
 * | DEPTH_COMPONENT32F | DEPTH_COMPONENT | FLOAT                          | 4                      |                    |                     |
 * | DEPTH24_STENCIL8   | DEPTH_STENCIL   | UNSIGNED_INT_24_8              | 4                      |                    |                     |
 * | DEPTH32F_STENCIL8  | DEPTH_STENCIL   | FLOAT_32_UNSIGNED_INT_24_8_REV | 8                      |                    |                     |
 * | RGBA               | RGBA            | UNSIGNED_BYTE                  | 4                      |                    |                     |
 * | RGBA               | RGBA            | UNSIGNED_SHORT_4_4_4_4         | 2                      |                    |                     |
 * | RGBA               | RGBA            | UNSIGNED_SHORT_5_5_5_1         | 2                      |                    |                     |
 * | RGB                | RGB             | UNSIGNED_BYTE                  | 3                      |                    |                     |
 * | RGB                | RGB             | UNSIGNED_SHORT_5_6_5           | 2                      |                    |                     |
 * | LUMINANCE_ALPHA    | LUMINANCE_ALPHA | UNSIGNED_BYTE                  | 2                      |                    |                     |
 * | LUMINANCE          | LUMINANCE       | UNSIGNED_BYTE                  | 1                      |                    |                     |
 * | ALPHA              | ALPHA           | UNSIGNED_BYTE                  | 1                      |                    |                     |
 **/

export const getTextureParas = (gl: WebGL2RenderingContext, t: TextureType, data: number[]) => {
    switch (t) {
        case 'ubyte4':
            return {
                internalFormat: gl.RGBA,
                format: gl.RGBA,
                type: gl.UNSIGNED_BYTE,
                binData: new Uint8Array(data),
            };
        case 'float1':
            return {
                internalFormat: gl.R32F,
                format: gl.RED,
                type: gl.FLOAT,
                binData: new Float32Array(data),
            };
        case 'float4':
            return {
                internalFormat: gl.RGBA32F,
                format: gl.RGBA,
                type: gl.FLOAT,
                binData: new Float32Array(data),
            };
    }
};

export const inferTextureType = (gl: WebGL2RenderingContext, to: TextureObject): TextureType => {
    if (to.internalformat === gl.RGBA && to.type === gl.UNSIGNED_BYTE) {
        return 'ubyte4';
    } else if (to.internalformat === gl.R32F && to.type === gl.FLOAT) {
        return 'float1';
    } else if (to.internalformat === gl.RGBA32F && to.type === gl.FLOAT){
        return 'float4';
    } else {
        throw new Error(`Unknkown texture-object-paras: internalformat ${to.internalformat}, type: ${to.type}`);
    }
};

/**
 * A shader's attributes get their buffer-values from the VERTEX_ARRAY, but they are constructed in the ARRAY_BUFFER.
 * Textures analogously are served from the TEXTURE_UNITS, while for construction they are bound to ACTIVE_TEXTURE.
 *
 * There is a big difference, however. Contrary to buffers which receive their initial value while still outside the ARRAY_BUFFER,
 * a texture does already have to be bound into the TEXTURE_UNITS when it's being created.
 * Since it'll always be bound into the slot that ACTIVE_TEXTURE points to, you can inadvertently overwrite another texture that is
 * currently in this place. To avoid this, we provide a dedicated `textureConstructionBindPoint`.
 *
 * Buffers are easier in this, since with vertexAttribPointer we are guaranteed to get a slot in the VERTEX_ARRAY that is not
 * already occupied by another buffer.
 */
export const createTexture = (gl: WebGL2RenderingContext, image: HTMLImageElement | HTMLCanvasElement): TextureObject => {

    const texture = gl.createTexture();  // analog to createBuffer
    if (!texture) {
        throw new Error('No texture was created');
    }
    gl.activeTexture(gl.TEXTURE0 + textureConstructionBindPoint); // so that we don't overwrite another texture in the next line.
    gl.bindTexture(gl.TEXTURE_2D, texture);  // analog to bindBuffer. Binds texture to currently active texture-bindpoint (aka. texture unit).

    const level = 0;
    const internalFormat = gl.RGBA;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, image);  // analog to bufferData
    gl.generateMipmap(gl.TEXTURE_2D); // mipmaps are mini-versions of the texture.
    gl.bindTexture(gl.TEXTURE_2D, null);  // unbinding

    let w, h: number;
    if (image instanceof HTMLImageElement) {
        w = image.naturalWidth;
        h = image.naturalHeight;
    } else {
        w = image.width;
        h = image.height;
    }

    const textureObj: TextureObject = {
        textureType: 'ubyte4',
        texture: texture,
        level: level,
        internalformat: internalFormat,
        format: format,
        type: type,
        width: w,
        height: h,
        border: 0
    };

    return textureObj;
};




/**
 * This is just another texture, but optimized for carrying data, not for display.
 *
 */
export const createDataTexture = (gl: WebGL2RenderingContext, data: number[][][], t: TextureType = 'ubyte4'): TextureObject => {
    const height = data.length;
    const width = data[0].length;
    const channels = data[0][0].length;
    if ( !isPowerOf(width, 2) || !isPowerOf(height, 2) ) {
        throw new Error(`Texture-data-dimensions must be a power of two, but are ${width} x ${height}`);
    }
    // if ( channels !== 4) {
    //     // @todo: remove this when we implement non-rgba data-textures.
    //     throw new Error(`Expecting 4 channels, but ${channels} provided`);
    // }

    const texture = gl.createTexture();  // analog to createBuffer
    if (!texture) {
        throw new Error('No texture was created');
    }
    gl.activeTexture(gl.TEXTURE0 + textureConstructionBindPoint); // so that we don't overwrite another texture in the next line.
    gl.bindTexture(gl.TEXTURE_2D, texture);  // analog to bindBuffer. Binds texture to currently active texture-bindpoint (aka. texture unit).

    // to be used for data. we want no interpolation of data, so disallow mipmap and interpolation.
    const level = 0;
    const border = 0;
    const paras = getTextureParas(gl, t, flatten3(data));

    if (channels !== 4) {
        // have WebGL digest data one byte at a time.
        // (Per default tries 4 bytes at a time, which causes errors when our data is not a mulitple of 4).
        const alignment = 1; // valid values are 1, 2, 4, and 8.
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
    }

    gl.texImage2D(gl.TEXTURE_2D, level, paras.internalFormat, width, height, border, paras.format, paras.type, paras.binData); // analog to bufferData
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);  // unbinding


    const textureObj: TextureObject = {
        textureType: t,
        texture: texture,
        level: level,
        internalformat: paras.internalFormat,
        format: paras.format,
        type: paras.type,
        width: width,
        height: height,
        border: border
    };

    return textureObj;
};


export const createEmptyTexture = (gl: WebGL2RenderingContext, width: number, height: number, type: TextureType = 'ubyte4'): TextureObject => {
    if (width <= 0 || height <= 0) {
        throw new Error('Width and height must be positive.');
    }
    const texture = gl.createTexture();
    if (!texture) {
        throw new Error('No texture was created');
    }

    const paras = getTextureParas(gl, type, []);

    gl.activeTexture(gl.TEXTURE0 + textureConstructionBindPoint); // so that we don't overwrite another texture in the next line.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, paras.internalFormat, width, height, 0, paras.format, paras.type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    const textureObj: TextureObject = {
        textureType: type,
        texture: texture,
        level: 0,
        internalformat: paras.internalFormat,
        format: paras.format,
        type: paras.type,
        width: width,
        height: height,
        border: 0
    };

    return textureObj;
};


/**
 * Even though we reference textures as uniforms in a fragment shader, assigning an actual texture-value to that uniform works differently from normal uniforms.
 * Normal uniforms have a concrete value.
 * Texture uniforms, on the other hand, are just an integer-index that points to a special slot in the GPU memory (the bindPoint) where the actual texture value lies.
 */
export const bindTextureToUniform = (gl: WebGL2RenderingContext, texture: WebGLTexture, bindPoint: number, uniformLocation: WebGLUniformLocation): void =>  {
    if (bindPoint > gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) {
        throw new Error(`There are only ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)} texture bind points, but you tried to bind to point nr. ${bindPoint}.`);
    }
    if (bindPoint === textureConstructionBindPoint) {
        console.error(`You are about to bind to the dedicated texture-construction bind point (nr. ${bindPoint}).
        If after this call another texture is built, your shader will now use that new texture instead of this one!
        Consider using another bind point.`);
    }
    gl.activeTexture(gl.TEXTURE0 + bindPoint);  // pick active texture-slot. analog to enableVertexAttribArray
    gl.bindTexture(gl.TEXTURE_2D, texture);  // analog to bindBuffer. Binds texture to currently active texture-bindpoint (aka. texture unit).
    gl.uniform1i(uniformLocation, bindPoint); // tell program where to find texture-uniform. analog to vertexAttribPointer
};



export const updateTexture = (gl: WebGL2RenderingContext, to: TextureObject, newData: HTMLImageElement | HTMLCanvasElement | number[][][]): TextureObject => {

    gl.activeTexture(gl.TEXTURE0 + textureConstructionBindPoint); // so that we don't overwrite another texture in the next line.
    gl.bindTexture(gl.TEXTURE_2D, to.texture);  // analog to bindBuffer. Binds texture to currently active texture-bindpoint (aka. texture unit).
    if (newData instanceof HTMLImageElement || newData instanceof HTMLCanvasElement) {
        gl.texImage2D(gl.TEXTURE_2D, 0, to.internalformat, to.format, to.type, newData);  // analog to bufferData
    } else {
        const width = newData[0].length;
        const height = newData.length;
        if ( !isPowerOf(width, 2) || !isPowerOf(height, 2) ) {
            throw new Error(`Texture-data-dimensions must be a power of two, but are ${height} x ${width}`);
        }

        const paras = getTextureParas(gl, to.textureType, flatten3(newData));
        gl.texImage2D(gl.TEXTURE_2D, to.level, to.internalformat, to.width, to.height, to.border, to.format, to.type, paras.binData);
    }
    gl.generateMipmap(gl.TEXTURE_2D); // mipmaps are mini-versions of the texture.
    gl.bindTexture(gl.TEXTURE_2D, null);  // unbinding

    if (newData instanceof HTMLImageElement) {
        to.width = newData.naturalWidth;
        to.height = newData.naturalHeight;
    } else if (newData instanceof HTMLCanvasElement) {
        to.width = newData.width;
        to.height = newData.height;
    } else {
        to.width = newData[0].length;
        to.height = newData.length;
    }

    return to;
};


export interface FramebufferObject {
    framebuffer: WebGLFramebuffer;
    texture: TextureObject;
    width: number;
    height: number;
}


export const createFramebuffer = (gl: WebGL2RenderingContext): WebGLFramebuffer => {
    const fb = gl.createFramebuffer();  // analog to createBuffer
    if (!fb) {
        throw new Error(`Error creating framebuffer`);
    }
    return fb;
};


/**
 * The operations `clear`, `drawArrays` and `drawElements` only affect the currently bound framebuffer.
 *
 * Note that binding the framebuffer does *not* mean binding its texture.
 * In fact, if there is a bound texture, it must be the *input* to a shader, not the output.
 * Therefore, a framebuffer's texture must not be bound when the framebuffer is.
 */
export const bindFramebuffer = (gl: WebGL2RenderingContext, fbo: FramebufferObject, manualViewport?: [number, number, number, number]) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
    // It's EXTREMELY IMPORTANT to remember to call gl.viewport and set it to the size of the thing your rendering to.
    // https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
    if (manualViewport) {
        if ((fbo.width / fbo.height) !== (manualViewport[2] / manualViewport[3])) {
            console.warn(`Your viewport-aspect is different from the framebuffer-aspect.`);
        }
        gl.viewport(...manualViewport);
    } else {
        gl.viewport(0, 0, fbo.width, fbo.height);
    }
};

/**
 * Webgl renders to the viewport, which is relative to canvas.width * canvas.height.
 * (To be more precise, only *polygons* are clipped to the viewport.
 * Operations like `clearColor()` et.al., will still draw to the *full* canvas.width * height!
 * If you want to also constrain clearColor, use `scissor` instead of viewport.)
 * That canvas.width * canvas.height then gets stretched to canvas.clientWidth * canvas.clientHeight.
 * (Note: the full canvas.width gets stretched to clientWidth, not just the viewport!)
 */
export const bindOutputCanvasToFramebuffer = (gl: WebGL2RenderingContext, manualViewport?: [number, number, number, number]) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // It's EXTREMELY IMPORTANT to remember to call gl.viewport and set it to the size of the thing your rendering to.
    // https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html
    if (manualViewport) {
        if ((gl.canvas.width / gl.canvas.height) !== (manualViewport[2] / manualViewport[3])) {
            console.warn(`Your viewport-aspect is different from the canvas-aspect.`);
        }
        gl.viewport(...manualViewport);
    } else {
        // Note: don't use clientWidth here.
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
};


/**
 * A framebuffer can have a texture - that is the bitmap that the shader-*out*put is drawn on.
 * Shaders may also have one or more *in*put texture(s), which must be provided to the shader as a uniform sampler2D.
 * Only the shader needs to know about any potential input texture, the framebuffer will always only know about it's output texture.
 */
export const bindTextureToFramebuffer = (gl: WebGL2RenderingContext, texture: TextureObject, fb: WebGLFramebuffer): FramebufferObject => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.texture, 0); // analog to bufferData

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Error creating framebuffer: framebuffer-status: ${gl.checkFramebufferStatus(gl.FRAMEBUFFER)} ; error-code: ${gl.getError()}`);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const fbo: FramebufferObject = {
        framebuffer: fb,
        texture: texture,
        width: texture.width,
        height: texture.height
    };

    return fbo;
};










/**
 * Fetch uniform's location (uniform declared in some shader). Slow! Do *before* render loop.
 */
export const getUniformLocation = (gl: WebGL2RenderingContext, program: WebGLProgram, uniformName: string): WebGLUniformLocation => {
    const loc = gl.getUniformLocation(program, uniformName);
    if (loc === null) {
        throw new Error(`Couldn't find uniform ${uniformName} in program.`);
    }
    return loc;
};






/**
 * Contrary to attributes, uniforms don't need to be stored in a buffer. (Note: in WebGL 2.0, however, there *are* uniform buffers!)
 *
 * 'v' is not about the shader, but how you provide data from the js-side.
 * uniform1fv(loc, [3.19]) === uniform1f(loc, 3.19)
 *
 * |js                                      |          shader                  |
 * |----------------------------------------|----------------------------------|
 * |uniform1f(loc, 3.19)                    |  uniform float u_pi;             |
 * |uniform2f(loc, 3.19, 2.72)              |  uniform vec2 u_constants;       |
 * |uniform2fv(loc, [3.19, 2.72])           |  uniform vec2 u_constants;       |
 * |uniform1fv(loc, [1, 2, 3, 4, 5, 6])     |  uniform float u_kernel[6];      |
 * |uniform2fv(loc, [1, 2, 3, 4, 5, 6])     |  uniform vec2 u_observations[3]; |
 * |uniformMatrix3fv(loc, [[...], [...]])   |  uniform mat3 u_matrix;          |
 *
 * A note about `structs`. A shader code like this:
 * ```glsl
 * struct LightInfo {
 *    vec4 Position;
 *    vec3 La;
 * };
 * uniform LightInfo Light;
 * ```
 * ... is accessed like that:
 * ```js
 * const lightPosLoc = gl.getUniformLocation(program, "Light.Position");
 * const lightLaLoc = gl.getUniformLocation(program, "Light.La");
 * gl.uniform4fv(lightPosLoc, [1, 2, 3, 4]);
 * gl.uniform3fv(lightLaLoc, [1, 2, 3]);
 * ```
 *
 */
export const bindValueToUniform = (gl: WebGL2RenderingContext, uniformLocation: WebGLUniformLocation, type: WebGLUniformType, values: number[]): void => {
    switch (type) {
        case 'bool':
            gl.uniform1i(uniformLocation, values[0]);
            break;
        case 'bvec2':
            gl.uniform2i(uniformLocation, values[0], values[1]);
            break;
        case 'bvec3':
            gl.uniform3i(uniformLocation, values[0], values[1], values[2]);
            break;
        case 'bvec4':
            gl.uniform4i(uniformLocation, values[0], values[1], values[2], values[3]);
            break;
        case 'bool[]':
            gl.uniform1iv(uniformLocation, values);
            break;
        case 'bvec2[]':
            gl.uniform2iv(uniformLocation, values);
            break;
        case 'bvec3[]':
            gl.uniform3iv(uniformLocation, values);
            break;
        case 'bvec4[]':
            gl.uniform4iv(uniformLocation, values);
            break;

        case 'int':
            gl.uniform1i(uniformLocation, values[0]);
            break;
        case 'ivec2':
            gl.uniform2i(uniformLocation, values[0], values[1]);
            break;
        case 'ivec3':
            gl.uniform3i(uniformLocation, values[0], values[1], values[2]);
            break;
        case 'ivec4':
            gl.uniform4i(uniformLocation, values[0], values[1], values[2], values[3]);
            break;
        case 'int[]':
            gl.uniform1iv(uniformLocation, values);
            break;
        case 'ivec2[]':
            gl.uniform2iv(uniformLocation, values);
            break;
        case 'ivec3[]':
            gl.uniform3iv(uniformLocation, values);
            break;
        case 'ivec4[]':
            gl.uniform4iv(uniformLocation, values);
            break;

        case 'float':
            gl.uniform1f(uniformLocation, values[0]);
            break;
        case 'vec2':
            gl.uniform2f(uniformLocation, values[0], values[1]);
            break;
        case 'vec3':
            gl.uniform3f(uniformLocation, values[0], values[1], values[2]);
            break;
        case 'vec4':
            gl.uniform4f(uniformLocation, values[0], values[1], values[2], values[3]);
            break;
        case 'float[]':
            gl.uniform1fv(uniformLocation, values);
            break;
        case 'vec2[]':
            gl.uniform2fv(uniformLocation, values);
            break;
        case 'vec3[]':
            gl.uniform3fv(uniformLocation, values);
            break;
        case 'vec4[]':
            gl.uniform4fv(uniformLocation, values);
            break;

        // In the following *matrix* calls, the 'transpose' parameter must always be false.
        // Quoting the OpenGL ES 2.0 spec:
        // If the transpose parameter to any of the UniformMatrix* commands is
        // not FALSE, an INVALID_VALUE error is generated, and no uniform values are
        // changed.
        case 'mat2':
            gl.uniformMatrix2fv(uniformLocation, false, values);
            break;

        case 'mat3':
            gl.uniformMatrix3fv(uniformLocation, false, values);
            break;

        case 'mat4':
            gl.uniformMatrix4fv(uniformLocation, false, values);
            break;

        default:
            throw Error(`Type ${type} not implemented.`);
    }
};


/**
 * (From https://hacks.mozilla.org/2013/04/the-concepts-of-webgl/ and https://stackoverflow.com/questions/56303648/webgl-rendering-buffers:)
 * Ignoring handmade framebuffers, WebGl has two framebuffers that are always in use: the `frontbuffer/displaybuffer` and the `backbuffer/drawingbuffer`.
 * WebGl per default renders to the `drawingbuffer`, aka. the `backbuffer`.
 * There is also the currently displayed buffer, named the `frontbuffer` aka. the `displaybuffer`.
 * the WebGL programmer has no explicit access to the frontbuffer whatsoever.
 *
 * Once you called `clear`, `drawElements` or `drawArrays`, the browser marks the canvas as `needs to be composited`.
 * Assuming `preserveDrawingBuffer == false` (the default): Immediately before compositing, the browser
 *  - swaps the back- and frontbuffer
 *  - clears the new backbuffer.
 * If `preserveDrawingBuffer === true`: Immediately before compositing, the browser
 *  - copies the drawingbuffer to the frontbuffer.
 *
 * As a consequence, if you're going to use canvas.toDataURL or canvas.toBlob or gl.readPixels or any other way of getting data from a WebGL canvas,
 * unless you read it in the same event it will likely have been cleared when you try to read it.
 *
 * In the past, old games always preserved the drawing buffer, so they'd only have to change those pixels that have actually changed. Nowadays preserveDrawingBuffer is false by default.
 *
 * A (almost brutal) workaround to get the canvas to preserve the drawingBuffer can be found here: https://stackoverflow.com/questions/26783586/canvas-todataurl-returns-blank-image
 *
 *
 *
 * glReadPixels returns pixel data from the frame buffer, starting with the pixel whose lower left corner is at location (x, y),
 * into client memory starting at location data. The GL_PACK_ALIGNMENT parameter, set with the glPixelStorei command,
 * affects the processing of the pixel data before it is placed into client memory.
 * glReadPixels returns values from each pixel with lower left corner at x + i y + j for 0 <= i < width and 0 <= j < height .
 * This pixel is said to be the ith pixel in the jth row. Pixels are returned in row order from the lowest to the highest row,
 * left to right in each row.
 * Return values are placed in memory as follows. If format is GL_ALPHA, a single value is returned and the data for the ith pixel
 * in the jth row is placed in location j ⁢ width + i . GL_RGB returns three values and GL_RGBA returns four values for each pixel,
 * with all values corresponding to a single pixel occupying contiguous space in data. Storage parameter GL_PACK_ALIGNMENT,
 * set by glPixelStorei, affects the way that data is written into memory. See glPixelStorei for a description.
 *
 * @TODO: WebGL2 allows to use `drawBuffer` and `readBuffer`, so that we are no longer limited to only the current framebuffer.
 */
export const getCurrentFramebuffersPixels = (canvas: HTMLCanvasElement): ArrayBuffer  => {
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!gl) {
        throw new Error('no context');
    }

    const format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
    const type = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);

    let pixels;
    if (type === gl.UNSIGNED_BYTE) {
        pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    } else if (type === gl.UNSIGNED_SHORT_5_6_5 || type === gl.UNSIGNED_SHORT_4_4_4_4 || type === gl.UNSIGNED_SHORT_5_5_5_1) {
        pixels = new Uint16Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    } else if (type === gl.FLOAT) {
        pixels = new Float32Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    } else {
        throw new Error(`Did not understand pixel data type ${type} for format ${format}`);
    }

    // Just like `toDataURL` or `toBlob`, `readPixels` does not access the frontbuffer.
    // It accesses the backbuffer or any other currently active framebuffer.
    gl.readPixels(0, 0, canvas.width, canvas.height, format, type, pixels);

    return pixels;
};

export const getDebugInfo = (gl: WebGL2RenderingContext): object => {
    const baseInfo = {
        renderer: gl.getParameter(gl.RENDERER),
        currentProgram: gl.getParameter(gl.CURRENT_PROGRAM),
        arrayBuffer: gl.getParameter(gl.ARRAY_BUFFER_BINDING),
        elementArrayBuffer: gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING),
        frameBuffer: gl.getParameter(gl.FRAMEBUFFER_BINDING),
        renderBuffer: gl.getParameter(gl.RENDERBUFFER_BINDING),
        texture: gl.getParameter(gl.TEXTURE_BINDING_2D),
        viewPort: gl.getParameter(gl.VIEWPORT)
    };
    const programInfo = {
        infoLog: gl.getProgramInfoLog(baseInfo.currentProgram)
    };
    return {
        baseInfo, programInfo
    };
};
