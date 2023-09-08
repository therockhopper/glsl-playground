// precision mediump float;

// void main() {
    //     gl_FragColor = vec4(1.0, 0.2, 0.3, 1.0);
// }

precision mediump float;

uniform float time;

void main(){
    vec4 baseColor=vec4(1.,.2,.3,1.);
    vec4 shimmerColor=vec4(1.,1.,1.,.5);
    float shimmerAmount=.1;
    float shimmerSpeed=5.;
    float shimmer=sin(time*shimmerSpeed)*shimmerAmount;
    gl_FragColor=mix(baseColor,shimmerColor,shimmer);
}