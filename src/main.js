import { createShader, createProgram } from "./utils";

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

// Create a texture to render the image to
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// Set the texture parameters
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// Load the image
const image = new Image();
image.src = './src/assets/dog.jpeg';
image.onload = () => {
    console.log('onload', texture)
    // Bind the texture and upload the image data
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Create a buffer to render the image to
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        -1, 1,
        1, 1,
        1, -1,
    ]), gl.STATIC_DRAW);

    // Create a vertex shader that renders the buffer
    const vertexShaderSource = `
        attribute vec2 position;

        void main() {
            gl_Position = vec4(position * vec2(1.0, -1.0), 0.0, 1.0);
        }
    `;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    // Create a fragment shader that applies the effect
    const fragmentShaderSource = `
        precision mediump float;
        uniform float time;

        uniform sampler2D texture;

        void main() {
            vec4 color = texture2D(texture, gl_FragCoord.xy / vec2(${image.width}, ${image.height}));
            vec4 shimmerColor=vec4(1.,1.,1.,.5);
            float shimmerAmount=.2;
            float shimmerSpeed=5.;
            float shimmer=sin(time*shimmerSpeed)*shimmerAmount;
            gl_FragColor= mix(color,shimmerColor,shimmer);
        }
    `;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create a program and link the shaders
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Set up the attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const textureUniformLocation = gl.getUniformLocation(program, 'texture');

    console.log("program:", program);
    console.log("positionAttributeLocation:", positionAttributeLocation);
    console.log("textureUniformLocation:", textureUniformLocation);

    // Set up the buffer and texture attributes
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(textureUniformLocation, 0);

    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
        console.error(`WebGL error: ${error}`);
    }

    gl.useProgram(program);

    // Render the buffer to the texture
    gl.viewport(0, 0, image.width, image.height);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // Render the texture to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

};