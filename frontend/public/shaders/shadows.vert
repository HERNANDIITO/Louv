#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_shadowMatrix;

void main() {
    vec4 worldPos = u_model * vec4(a_position, 1.0f);
    worldPos = u_shadowMatrix * worldPos;
    gl_Position = u_projection * u_view * worldPos;
}