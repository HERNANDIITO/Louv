#version 300 es
precision highp float;

uniform samplerCube u_cube;
in vec3 v_texCoords;
out vec4 fragColor;

void main() {
    vec3 color = textureLod(u_cube, v_texCoords, 0.0).rgb;
    fragColor = vec4(color, 1.0);
}