#version 300 es
precision highp float;

#define MAX_LIGHTS 4

struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
};
struct DirLight {
    vec3 direction;
    vec3 color;
    float intensity;
};

struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float intensity;
    float distance;
    float decay;
    float cutoff;
    float outerCutoff;
};

struct AmbientLight {
    vec3 color;
    float intensity;
};

in vec3 v_worldPos;
in vec3 v_normal;
in vec2 v_uv;

uniform vec3 u_color;
uniform sampler2D u_AlbedoMap;
uniform float u_roughness;
uniform float u_metalness;
uniform vec3 u_cameraPos;

uniform PointLight u_pointLights[MAX_LIGHTS];
uniform int u_pointLightCount;
uniform DirLight u_dirLights[MAX_LIGHTS];
uniform int u_dirLightCount;
uniform SpotLight u_spotLights[MAX_LIGHTS];
uniform int u_spotLightCount;
uniform AmbientLight u_ambientLight;

out vec4 fragColor;

vec2 calculateBlinnPhong(vec3 L, vec3 N, vec3 V, float shininess) {
    float diff = max(dot(N, L), 0.0f);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0f), shininess);
    return vec2(diff, spec);
}

void main() {
    vec3 materialColor = texture(u_AlbedoMap, v_uv).rgb * u_color;

    vec3 diffuseMaterial = materialColor * (1.0f - u_metalness);
    vec3 specularMaterial = materialColor * u_metalness;

    float shininess = pow(2.0f, (1.0f - u_roughness) * 10.0f);

    vec3 N = normalize(v_normal);
    vec3 V = normalize(u_cameraPos - v_worldPos);

    vec3 totalDiffuse = vec3(0.0f);
    vec3 totalSpecular = vec3(0.0f);

    for(int i = 0; i < u_dirLightCount && i < MAX_LIGHTS; i++) {
        vec3 L = normalize(-u_dirLights[i].direction);
        vec3 lightColor = u_dirLights[i].color * u_dirLights[i].intensity;

        vec2 res = calculateBlinnPhong(L, N, V, shininess);
        totalDiffuse += res.x * lightColor;
        totalSpecular += res.y * lightColor;
    }

    for(int i = 0; i < u_pointLightCount && i < MAX_LIGHTS; i++) {
        vec3 L_vec = u_pointLights[i].position - v_worldPos;
        vec3 L = normalize(L_vec);
        float dist = length(L_vec);
        float attenuation = 1.0f / (dist * dist);

        vec3 lightColor = u_pointLights[i].color * u_pointLights[i].intensity * attenuation;

        vec2 res = calculateBlinnPhong(L, N, V, shininess);
        totalDiffuse += res.x * lightColor;
        totalSpecular += res.y * lightColor;
    }

    for(int i = 0; i < u_spotLightCount && i < MAX_LIGHTS; i++) {
        vec3 L_vec = u_spotLights[i].position - v_worldPos;
        vec3 L = normalize(L_vec);
        float d = length(L_vec);

        float theta = dot(L, normalize(-u_spotLights[i].direction));
        float epsilon = u_spotLights[i].cutoff - u_spotLights[i].outerCutoff;
        float spotIntensity = clamp((theta - u_spotLights[i].outerCutoff) / epsilon, 0.0f, 1.0f);

        if(theta > u_spotLights[i].outerCutoff) {
            float attenuation = (u_spotLights[i].distance > 0.0f) ? pow(clamp(1.0f - d / u_spotLights[i].distance, 0.0f, 1.0f), u_spotLights[i].decay) : 1.0f;

            vec3 lightColor = u_spotLights[i].color * u_spotLights[i].intensity * attenuation * spotIntensity;

            vec2 res = calculateBlinnPhong(L, N, V, shininess);
            totalDiffuse += res.x * lightColor;
            totalSpecular += res.y * lightColor;
        }
    }

    // El 0.35 lo añado para balancear la visualización entre PBR y Phong 
    // y que no quede este shader muy brillante con la misma luz ambiental.
    vec3 ambient = u_ambientLight.color * (u_ambientLight.intensity - 0.35f) * materialColor;
    vec3 diffuse = totalDiffuse * diffuseMaterial;
    vec3 specular = totalSpecular * specularMaterial;
    vec3 finalColor = ambient + diffuse + specular;

    // Corrección de gamma simple.
    finalColor = pow(finalColor, vec3(1.0f / 2.2f));

    fragColor = vec4(finalColor, 1.0f);
}