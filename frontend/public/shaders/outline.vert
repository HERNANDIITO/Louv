#version 300 es
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform float u_thickness;
uniform float u_aspect;

void main() {
    // Posición estándar
    vec4 pos = u_projection * u_view * u_model * vec4(a_position, 1.0f);

    // Normal en espacio de pantalla (esto es lo que da el grosor)
    vec3 clipNormal = mat3(u_projection * u_view * u_model) * a_normal;
    vec2 offset = normalize(clipNormal.xy);

    // Ajuste de aspecto para que no se estire
    offset.x /= u_aspect;

    // Expandimos en 2D. 
    // u_thickness debería ser aprox 0.01 o 0.02
    pos.xy += offset * u_thickness * pos.w;

    gl_Position = pos;
}