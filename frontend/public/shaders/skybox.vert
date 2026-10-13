#version 300 es
layout(location = 0) in vec3 a_position;
out vec3 v_texCoords;

uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
    v_texCoords = a_position;
    mat4 view = mat4(mat3(u_view));
    vec4 pos = u_projection * view * vec4(a_position, 1.0f);
    gl_Position = pos.xyww;
}