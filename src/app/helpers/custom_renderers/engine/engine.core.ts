import { bindIndexBuffer, bindProgram, bindTextureToUniform, bindValueToUniform, BufferObject, createBuffer,
    createIndexBuffer, createShaderProgram, createTexture, drawArray, drawElements, getAttributeLocation,
    getUniformLocation, IndexBufferObject, TextureObject, WebGLUniformType, drawElementsInstanced, drawArrayInstanced,
    GlDrawingMode, bindVertexArray, createVertexArray, VertexArrayObject, bindBufferToAttributeVertexArray,
    bindBufferToAttributeInstancedVertexArray, updateBufferData, updateTexture, FramebufferObject, bindOutputCanvasToFramebuffer, bindFramebuffer, clearBackground, WebGLAttributeType, createFramebuffer, bindTextureToFramebuffer, createEmptyTexture} from './webgl';




// dead-simple hash function - not intended to be secure in any way.
const hash = function(s: string): string {
    let h = 0;
    for (const c of s) {
        h += c.charCodeAt(0);
    }
    return `${h}`;
};

export function renderLoop(fps: number, renderFunction: (tDelta: number) => void): void {

    const tDeltaTarget = 1000 * 1.0 / fps;
    let tDelta = tDeltaTarget;
    let tStart, tNow, tSleep: number;

    const render = () => {
        tStart = window.performance.now();

        renderFunction(tDelta);

        tNow = window.performance.now();
        tDelta = tNow - tStart;
        tSleep = Math.max(tDeltaTarget - tDelta, 0);
        setTimeout(() => {
            requestAnimationFrame(render);
        }, tSleep);

    };

    render();
}


function parseProgram(program: Program): [string[], string[], string[], string[]] {
    // @TODO: adjust this to use WebGL2 syntax.
    const attributeRegex = /^\s*attribute (int|float|vec2|vec3|vec4|mat2|mat3|mat4) (\w*);/gm;
    const uniformRegex = /^\s*uniform (int|float|vec2|vec3|vec4|mat2|mat3|mat4) (\w*)(\[\d\])*;/gm;
    const textureRegex = /^\s*uniform sampler2D (\w*);/gm;
    const precisionRegex = /^\s*precision (\w*) float;/gm;

    const shaderCode = program.fragmentShaderSource + '\n\n\n' + program.vertexShaderSource;

    const attributeNames = [];
    let attributeMatches;
    while ((attributeMatches = attributeRegex.exec(shaderCode)) !== null) {
        attributeNames.push(attributeMatches[2]);
    }
    const uniformNames = [];
    let uniformMatches;
    while ((uniformMatches = uniformRegex.exec(shaderCode)) !== null) {
        uniformNames.push(uniformMatches[2]);
    }
    const textureNames = [];
    let textureMatches;
    while ((textureMatches = textureRegex.exec(shaderCode)) !== null) {
        textureNames.push(textureMatches[1]);
    }

    const precisions = [];
    let precisionMatches;
    while ((precisionMatches = precisionRegex.exec(shaderCode)) !== null) {
        precisions.push(precisionMatches[1]);
    }

    return [attributeNames, uniformNames, textureNames, precisions];
}

function checkDataProvided(
    program: Program,
    attributes: {[k: string]: AttributeData},
    uniforms: {[k: string]: UniformData},
    textures: {[k: string]: TextureData},
    ) {
    const [attributeNames, uniformNames, textureNames, precisions] = parseProgram(program);
    // for (const attrName of attributeNames) {
    //     if (!attributes[attrName]) {
    //         throw new Error(`Provided no values for shader's attribute ${attrName}.`);
    //     }
    // }
    // for (const uniformName of uniformNames) {
    //     if (!uniforms[uniformName]) {
    //         throw new Error(`Provided no values for shader's uniform ${uniformName}.`);
    //     }
    // }
    // for (const texName of textureNames) {
    //     if (!textures[texName]) {
    //         throw new Error(`Provided no values for shader's texture ${texName}.`);
    //     }
    // }
    // if (precisions.length === 1) {
    //     console.warn(`You have only provided one precision qualifier.
    //     This can cause issues when you want to use a uniform in both the vertex- and the fragment-shader.`);
    // }
    // @TODO: the below code does not account for instanced attributes.
    // const lengths = Object.values(attributes).map(a => a.data.length);
    // if (Math.min(...lengths) !== Math.max(...lengths)) {
    //     throw new Error(`Your attributes are not of the same length!`);
    // }
}

interface IAttributeData {
    hash: string;
    changesOften: boolean;
    attributeType: WebGLAttributeType;
    data: number[];
    buffer: BufferObject;
    upload (gl: WebGL2RenderingContext): void;
    bind (gl: WebGL2RenderingContext, location: number, va: VertexArrayObject): VertexArrayObject;
    update (gl: WebGL2RenderingContext, newData: number[]): void;
}


/**
 * Data container.
 * Abstracts all webgl-calls to attribute-api.
 * Maintains copy of data locally, so it can be up- and unloaded by context
 * without loosing the original data.
 */
export class AttributeData implements IAttributeData {

    readonly hash: string;
    changesOften: boolean;
    attributeType: WebGLAttributeType;
    data: number[];      // raw data, user-provided
    buffer: BufferObject;  // buffer on gpu
    constructor(data: number[], attrType: WebGLAttributeType, changesOften: boolean) {
        this.data = data;
        this.attributeType = attrType;
        this.changesOften = changesOften;
        this.hash = hash(data + '');
    }

    upload(gl: WebGL2RenderingContext) {
        this.buffer = createBuffer(gl, this.attributeType, this.data, this.changesOften);
    }

    bind(gl: WebGL2RenderingContext, location: number, va: VertexArrayObject) {
        if (!this.buffer) {
            throw Error(`No value set for AttributeData`);
        }
        va = bindBufferToAttributeVertexArray(gl, location, this.buffer, va);
        return va;
    }

    update(gl: WebGL2RenderingContext, newData: number[]) {
        this.data = newData;
        this.buffer = updateBufferData(gl, this.buffer, this.data);
    }

}

export class InstancedAttributeData implements IAttributeData {

    readonly hash: string;
    attributeType: WebGLAttributeType;
    changesOften: boolean;
    data: number[];      // raw data, user-provided
    buffer: BufferObject;  // buffer on gpu
    /**
     * Number of instances that will be rotated through before moving along one step of this buffer.
     * I.e. each entry in this buffer remains the same for `nrInstances` instances,
     * that is, for `nrInstances * data.length` vertices.
     */
    nrInstances: number;
    constructor(data: number[], attrType: WebGLAttributeType, changesOften: boolean, nrInstances: number) {
        this.data = data;
        this.attributeType = attrType;
        this.changesOften = changesOften;
        this.nrInstances = nrInstances;
        this.hash = hash(data + '');
    }

    upload(gl: WebGL2RenderingContext) {
        this.buffer = createBuffer(gl, this.attributeType, this.data, this.changesOften);
    }

    bind(gl: WebGL2RenderingContext, location: number, va: VertexArrayObject) {
        if (!this.buffer) {
            throw Error(`No value set for AttributeData`);
        }
        va = bindBufferToAttributeInstancedVertexArray(gl, location, this.buffer, this.nrInstances, va);
        return va;
    }

    update(gl: WebGL2RenderingContext, newData: number[]) {
        this.data = newData;
        this.buffer = updateBufferData(gl, this.buffer, this.data);
    }
}


/**
 * Data container.
 * Abstracts all webgl-calls to uniform-api.
 * Maintains copy of data locally, so it can be up- and unloaded by context
 * without loosing the original data.
 */
export class UniformData {

    hash: string;
    value: number[];
    uniformType: WebGLUniformType;
    constructor(type: WebGLUniformType, value: number[]) {
        this.uniformType = type;
        this.value = value;
        this.hash = hash(value + '');
    }

    upload(gl: WebGL2RenderingContext) {
        // uniforms are always uploaded directly, without a buffer.
        // (In WebGL2, however, there *are* uniform-buffers!)
    }

    bind(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
        bindValueToUniform(gl, location, this.uniformType, this.value);
    }

    update(gl: WebGL2RenderingContext, newData: number[], location: WebGLUniformLocation) {
        this.value = newData;
        this.bind(gl, location);
    }
}


/**
 * Data container.
 * Abstracts all webgl-calls to texture-api.
 * Maintains copy of data locally, so it can be up- and unloaded by context
 * without loosing the original data.
 */
export class TextureData {

    hash: string;
    data: TextureObject | HTMLImageElement | HTMLCanvasElement;  // raw data, user-provided
    texture: TextureObject;                                      // buffer on gpu
    constructor(im: HTMLImageElement | HTMLCanvasElement | TextureObject) {
        this.data = im;
        this.hash = hash(Math.random() * 1000 + ''); // @TODO: how do you hash textures?
    }

    upload(gl: WebGL2RenderingContext) {
        if (this.data instanceof HTMLImageElement || this.data instanceof  HTMLCanvasElement) {
            this.texture = createTexture(gl, this.data);
        } else {
            this.texture = this.data;
        }
    }

    bind(gl: WebGL2RenderingContext, location: WebGLUniformLocation, bindPoint: number) {
        if (!this.texture) {
            throw new Error(`No texture for TextureData`);
        }
        bindTextureToUniform(gl, this.texture.texture, bindPoint, location);
    }

    update(gl: WebGL2RenderingContext, newData: HTMLImageElement | HTMLCanvasElement) {
        this.data = newData;
        this.texture = updateTexture(gl, this.texture, newData);
    }
}

/**
 * Data container.
 * Abstracts all webgl-calls to index-api.
 * Maintains copy of data locally, so it can be up- and unloaded by context
 * without loosing the original data.
 */
export class Index {

    data: number[];             // raw data, user-provided
    index: IndexBufferObject;     // buffer on gpu
    constructor(indices: number[]) {
        this.data = indices;
    }

    upload(gl: WebGL2RenderingContext) {
        this.index = createIndexBuffer(gl, this.data);
    }

    bind(gl: WebGL2RenderingContext) {
        if (!this.index) {
            throw new Error(`Index: indexBufferObject has not yet been uploaded.`);
        }
        bindIndexBuffer(gl, this.index);
    }
}





export class Program {

    program: WebGLProgram;
    readonly hash: string;
    uniformLocations: {[uName: string]: WebGLUniformLocation};
    attributeLocations: {[aName: string]: number};

    constructor(
        readonly vertexShaderSource: string,
        readonly fragmentShaderSource: string) {
            this.attributeLocations = {};
            this.uniformLocations = {};
            this.hash = hash(vertexShaderSource + fragmentShaderSource);
    }

    upload(gl: WebGL2RenderingContext) {
        this.program = createShaderProgram(gl, this.vertexShaderSource, this.fragmentShaderSource);
    }

    bind(gl: WebGL2RenderingContext) {
        if (!this.program) {
            this.upload(gl);
        }
        bindProgram(gl, this.program);
    }

    getUniformLocation(gl: WebGL2RenderingContext, uName: string) {
        if (!this.uniformLocations[uName]) {
            const location = getUniformLocation(gl, this.program, uName);
            this.uniformLocations[uName] = location;
        }
        return this.uniformLocations[uName];
    }

    getAttributeLocation(gl: WebGL2RenderingContext, aName: string) {
        if (!this.attributeLocations[aName]) {
            const location = getAttributeLocation(gl, this.program, aName);
            this.attributeLocations[aName] = location;
        }
        return this.attributeLocations[aName];
    }

    getTextureLocation(gl: WebGL2RenderingContext, tName: string) {
        return this.getUniformLocation(gl, tName);
    }
}



/**
 * Context: a wrapper around WebGL2RenderingContext.
 * Intercepts calls to upload, bind etc.
 * and checks if the data is *already* uploaded, bound, etc.
 * Saves on calls.
 *
 * @TODO: also wrap around bind-calls and vertex-arrays.
 * @TODO: check for overloading too many textures.
 */
export class Context {

    private loadedPrograms: string[] = [];
    private loadedAttributes: string[] = [];
    private loadedUniforms: string[] = [];
    private loadedTextures: string[] = [];

    constructor(readonly gl: WebGL2RenderingContext, private verbose = false) {}

    uploadProgram(prog: Program): void {
        if (!this.loadedPrograms.includes(prog.hash)) {
            prog.upload(this.gl);
            this.loadedPrograms.push(prog.hash);
            if (this.verbose) console.log(`Context: uploaded program ${prog.hash}`);
        } else {
            if (this.verbose) console.log(`Context: did not need to upload program ${prog.hash}`);
        }
    }

    uploadAttribute(data: AttributeData): void {
        if (!this.loadedAttributes.includes(data.hash)) {
            data.upload(this.gl);
            this.loadedAttributes.push(data.hash);
            if (this.verbose) console.log(`Context: uploaded attribute ${data.hash}`);
        } else {
            if (this.verbose) console.log(`Context: did not need to upload attribute ${data.hash}`);
        }
    }

    uploadUniform(data: UniformData): void {
        if (!this.loadedUniforms.includes(data.hash)) {
            data.upload(this.gl);
            this.loadedUniforms.push(data.hash);
            if (this.verbose) console.log(`Context: uploaded uniform ${data.hash}`);
        } else {
            if (this.verbose) console.log(`Context: did not need to upload uniform ${data.hash}`);
        }
    }

    uploadTexture(data: TextureData): void {
        if (!this.loadedTextures.includes(data.hash)) {
            data.upload(this.gl);
            this.loadedTextures.push(data.hash);
            if (this.verbose) console.log(`Context: uploaded texture ${data.hash}`);
        } else {
            if (this.verbose) console.log(`Context: did not need to upload texture ${data.hash}`);
        }
    }

    bindFramebuffer(fbo: FramebufferObject): void {
        throw new Error('Not yet implemented');
    }
}



export abstract class Bundle {
    program: Program;
    attributes: {[k: string]: IAttributeData};
    uniforms: {[k: string]: UniformData};
    textures: {[k: string]: TextureData};
    va: VertexArrayObject;
    drawingMode: GlDrawingMode;

    constructor(
        program: Program,
        attributes: {[k: string]: AttributeData},
        uniforms: {[k: string]: UniformData},
        textures: {[k: string]: TextureData},
        drawingMode: GlDrawingMode = 'triangles'
    ) {
        this.program = program;
        this.attributes = attributes;
        this.uniforms = uniforms;
        this.textures = textures;
        this.drawingMode = drawingMode;
        checkDataProvided(program, attributes, uniforms, textures);
    }

    public upload (context: Context): void {
        context.uploadProgram(this.program);

        for (const attributeName in this.attributes) {
            const data = this.attributes[attributeName];
            context.uploadAttribute(data);
        }

        for (const uniformName in this.uniforms) {
            const data = this.uniforms[uniformName];
            context.uploadUniform(data);
        }

        for (const textureName in this.textures) {
            const data = this.textures[textureName];
            context.uploadTexture(data);
        }
    }

    public initVertexArray(context: Context) {
        this.va = createVertexArray(context.gl);
        bindVertexArray(context.gl, this.va);

        for (const attributeName in this.attributes) {
            const data = this.attributes[attributeName];
            const loc = this.program.getAttributeLocation(context.gl, attributeName);
            this.va = data.bind(context.gl, loc, this.va);
        }
    }

    public bind (context: Context): void {
        bindProgram(context.gl, this.program.program);

        bindVertexArray(context.gl, this.va);

        for (const uniformName in this.uniforms) {
            const data = this.uniforms[uniformName];
            const loc = this.program.getUniformLocation(context.gl, uniformName);
            data.bind(context.gl, loc);
        }

        let bp = 1;
        for (const textureName in this.textures) {
            bp += 1;
            const data = this.textures[textureName];
            const loc = this.program.getTextureLocation(context.gl, textureName);
            data.bind(context.gl, loc, bp);
        }
    }


    public updateAttributeData(context: Context, variableName: string, newData: number[]): void {
        const attribute = this.attributes[variableName];
        if (!attribute) {
            throw new Error(`No such attribute ${variableName} to be updated.`);
        }
        attribute.update(context.gl, newData);
    }

    public updateUniformData(context: Context, variableName: string, newData: number[]): void {
        const uniform = this.uniforms[variableName];
        if (!uniform) {
            throw new Error(`No such uniform ${variableName} to be updated.`);
        }
        const location = this.program.getUniformLocation(context.gl, variableName);
        uniform.update(context.gl, newData, location);
    }

    public updateTextureData(context: Context, variableName: string, newImage: HTMLImageElement | HTMLCanvasElement): void {
        const original = this.textures[variableName];
        if (!original) {
            throw new Error(`No such texture ${variableName} to be updated.`);
        }
        original.update(context.gl, newImage);
    }

    public draw (context: Context, background?: number[], frameBuffer?: FramebufferObject, viewport?: [number, number, number, number]): void {
        if (!frameBuffer) {
            bindOutputCanvasToFramebuffer(context.gl, viewport);
        } else {
            bindFramebuffer(context.gl, frameBuffer, viewport);
        }
        if (background) {
            clearBackground(context.gl, background);
        }
    }

}

export class ArrayBundle extends Bundle {
    constructor(
        program: Program,
        attributes: {[k: string]: AttributeData},
        uniforms: {[k: string]: UniformData},
        textures: {[k: string]: TextureData},
        drawingMode: GlDrawingMode = 'triangles',
        readonly nrAttributes: number
    ) {
        super(program, attributes, uniforms, textures, drawingMode);
    }


    draw(context: Context, background?: number[], frameBuffer?: FramebufferObject, viewport?: [number, number, number, number]): void {
        super.draw(context, background, frameBuffer, viewport);
        drawArray(context.gl, this.drawingMode, this.nrAttributes, 0);
    }
}

export class ElementsBundle extends Bundle {
    constructor(
        program: Program,
        attributes: {[k: string]: AttributeData},
        uniforms: {[k: string]: UniformData},
        textures: {[k: string]: TextureData},
        drawingMode: GlDrawingMode = 'triangles',
        public index: Index,
    ) {
        super(program, attributes, uniforms, textures, drawingMode);
    }

    upload(context: Context): void {
        super.upload(context);
        this.index.upload(context.gl);
    }

    bind(context: Context): void {
        super.bind(context);
        this.index.bind(context.gl);
    }

    draw(context: Context, background?: number[], frameBuffer?: FramebufferObject, viewport?: [number, number, number, number]): void {
        super.draw(context, background, frameBuffer, viewport);
        this.index.bind(context.gl);
        drawElements(context.gl, this.index.index, this.drawingMode);
    }
}

export class InstancedArrayBundle extends Bundle {
    constructor(
        program: Program,
        attributes: {[k: string]: IAttributeData},
        uniforms: {[k: string]: UniformData},
        textures: {[k: string]: TextureData},
        drawingMode: GlDrawingMode = 'triangles',
        readonly nrAttributes: number,
        public nrInstances: number
    ) {
        super(program, attributes, uniforms, textures, drawingMode);
    }

    draw(context: Context, background?: number[], frameBuffer?: FramebufferObject, viewport?: [number, number, number, number]): void {
        super.draw(context, background, frameBuffer, viewport);
        drawArrayInstanced(context.gl, this.drawingMode, this.nrAttributes, 0, this.nrInstances);
    }
}

export class InstancedElementsBundle extends Bundle {
    constructor(
        program: Program,
        attributes: {[k: string]: IAttributeData},
        uniforms: {[k: string]: UniformData},
        textures: {[k: string]: TextureData},
        drawingMode: GlDrawingMode = 'triangles',
        public index: Index,
        public nrInstances: number
    ) {
        super(program, attributes, uniforms, textures, drawingMode);
    }

    upload(context: Context): void {
        super.upload(context);
        this.index.upload(context.gl);
    }

    bind(context: Context): void {
        super.bind(context);
        this.index.bind(context.gl);
    }

    draw(context: Context, background?: number[], frameBuffer?: FramebufferObject, viewport?: [number, number, number, number]): void {
        super.draw(context, background, frameBuffer, viewport);
        this.index.bind(context.gl);
        drawElementsInstanced(context.gl, this.index.index, this.drawingMode, this.nrInstances);
    }
}
