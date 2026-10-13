#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec4 a_tangent;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normalMatrix;

out vec3 v_worldPos;
out vec2 v_uv;
out mat3 v_TBN;

void main() {
    vec4 worldPos = u_model * vec4(a_position, 1.0);
    v_worldPos = worldPos.xyz;
    v_uv = a_uv;

    vec3 N = normalize(u_normalMatrix * a_normal);
    vec3 T = normalize(u_normalMatrix * a_tangent.xyz);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T) * a_tangent.w;
    v_TBN = mat3(T, B, N);

    gl_Position = u_projection * u_view * worldPos;
}