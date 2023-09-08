// import a function from node_modules
#pragma glslify: noise = require('glsl-noise/simplex/3d')

vec4 calc_frag_color(vec3 pos) {
  return vec4(noise(pos * 25.0), 1);
}

// export a function
#pragma glslify: export(calc_frag_color)