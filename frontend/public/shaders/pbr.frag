#version 300 es
precision highp float;

#define MAX_LIGHTS 4
#define PI 3.14159265359

struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
    float distance;
    float decay;
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
in vec2 v_uv;
in mat3 v_TBN;

uniform vec3 u_cameraPos, u_color, u_emissive;
uniform sampler2D u_AlbedoMap, u_NormalMap, u_MetallicMap, u_RoughnessMap, u_AOMap;
uniform samplerCube u_cube;
uniform float u_metalness, u_roughness, u_emissiveIntensity;

uniform PointLight u_pointLights[MAX_LIGHTS];
uniform int u_pointLightCount;
uniform DirLight u_dirLights[MAX_LIGHTS];
uniform int u_dirLightCount;
uniform SpotLight u_spotLights[MAX_LIGHTS];
uniform int u_spotLightCount;
uniform AmbientLight u_ambientLight;

out vec4 fragColor;

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a2 = pow(roughness * roughness, 2.0f);
    float NdotH2 = pow(max(dot(N, H), 0.0f), 2.0f);
    return a2 / (PI * pow(NdotH2 * (a2 - 1.0f) + 1.0f, 2.0f) + 1e-7f);
}
float GeometrySmith(vec3 N, vec3 V, vec3 L, float r) {
    float k = pow(r + 1.0f, 2.0f) / 8.0f;
    float G1V = max(dot(N, V), 0.0f) / (max(dot(N, V), 0.0f) * (1.0f - k) + k);
    float G1L = max(dot(N, L), 0.0f) / (max(dot(N, L), 0.0f) * (1.0f - k) + k);
    return G1V * G1L;
}
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0f - F0) * pow(clamp(1.0f - cosTheta, 0.0f, 1.0f), 5.0f);
}
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float r) {
    return F0 + (max(vec3(1.0f - r), F0) - F0) * pow(clamp(1.0f - cosTheta, 0.0f, 1.0f), 5.0f);
}

float getDistanceAttenuation(float lightDistance, float cutoffDistance, float decayExponent) {
    if(cutoffDistance > 0.0f) {
        return pow(clamp(-lightDistance / cutoffDistance + 1.0f, 0.0f, 1.0f), decayExponent);
    }
    return 1.0f / max(pow(lightDistance, decayExponent), 0.0001f);
}

void main() {
    vec3 baseColor = pow(texture(u_AlbedoMap, v_uv).rgb * u_color, vec3(2.2f));
    float metallic = texture(u_MetallicMap, v_uv).r * u_metalness;
    float roughness = clamp(texture(u_RoughnessMap, v_uv).r * u_roughness, 0.05f, 1.0f);
    float ao = texture(u_AOMap, v_uv).r;

    vec3 N = normalize(v_TBN * (texture(u_NormalMap, v_uv).xyz * 2.0f - 1.0f));
    vec3 V = normalize(u_cameraPos - v_worldPos);
    float NdotV = max(dot(N, V), 0.0001f);
    vec3 F0 = mix(vec3(0.04f), baseColor, metallic);

    vec3 directLo = vec3(0.0f);

    for(int i = 0; i < u_dirLightCount && i < MAX_LIGHTS; i++) {
        vec3 L = normalize(-u_dirLights[i].direction);
        vec3 H = normalize(V + L);
        float NdotL = max(dot(N, L), 0.0f);
        vec3 radiance = u_dirLights[i].color * u_dirLights[i].intensity;
        float D = DistributionGGX(N, H, roughness);
        float G = GeometrySmith(N, V, L, roughness);
        vec3 F = fresnelSchlick(max(dot(H, V), 0.0f), F0);
        vec3 spec = (D * G * F) / (4.0f * NdotV * NdotL + 0.001f);
        directLo += ((vec3(1.0f) - F) * (1.0f - metallic) * baseColor / PI + spec) * radiance * NdotL;
    }

    for(int i = 0; i < u_pointLightCount && i < MAX_LIGHTS; i++) {
        vec3 Lvec = u_pointLights[i].position - v_worldPos;
        float d = length(Lvec);
        vec3 L = normalize(Lvec);
        vec3 H = normalize(V + L);
        float atten = getDistanceAttenuation(d, u_pointLights[i].distance, u_pointLights[i].decay);
        vec3 radiance = u_pointLights[i].color * (u_pointLights[i].intensity * PI) * atten;
        float NdotL = max(dot(N, L), 0.0f);
        float D = DistributionGGX(N, H, roughness);
        float G = GeometrySmith(N, V, L, roughness);
        vec3 F = fresnelSchlick(max(dot(H, V), 0.0f), F0);
        vec3 spec = (D * G * F) / (4.0f * NdotV * NdotL + 0.001f);
        directLo += ((vec3(1.0f) - F) * (1.0f - metallic) * baseColor / PI + spec) * radiance * NdotL;
    }

    for(int i = 0; i < u_spotLightCount && i < MAX_LIGHTS; i++) {
        vec3 Lvec = u_spotLights[i].position - v_worldPos;
        float d = length(Lvec);
        vec3 L = normalize(Lvec);
        vec3 H = normalize(V + L);
        float theta = dot(L, normalize(-u_spotLights[i].direction));
        float epsilon = u_spotLights[i].cutoff - u_spotLights[i].outerCutoff;
        float spotAtten = clamp((theta - u_spotLights[i].outerCutoff) / epsilon, 0.0f, 1.0f);
        float atten = getDistanceAttenuation(d, u_spotLights[i].distance, u_spotLights[i].decay) * spotAtten;
        vec3 radiance = u_spotLights[i].color * u_spotLights[i].intensity * atten;
        float NdotL = max(dot(N, L), 0.0f);
        float D = DistributionGGX(N, H, roughness);
        float G = GeometrySmith(N, V, L, roughness);
        vec3 F = fresnelSchlick(max(dot(H, V), 0.0f), F0);
        vec3 spec = (D * G * F) / (4.0f * NdotV * NdotL + 0.001f);
        directLo += ((vec3(1.0f) - F) * (1.0f - metallic) * baseColor / PI + spec) * radiance * NdotL;
    }

    vec3 F_ibl = fresnelSchlickRoughness(NdotV, F0, roughness);
    vec3 irradiance = textureLod(u_cube, N, 8.0f).rgb;
    vec3 diffuseIBL = irradiance * baseColor * (1.0f - metallic);
    vec3 R = reflect(-V, N);
    vec3 prefiltered = textureLod(u_cube, R, roughness * 8.0f).rgb;
    vec3 specularIBL = prefiltered * F_ibl;
    vec3 ambient = (diffuseIBL + specularIBL) * ao * u_ambientLight.intensity;

    vec3 finalColor = directLo + ambient + (pow(u_emissive, vec3(2.2f)) * u_emissiveIntensity);

    finalColor = (finalColor * (2.51f * finalColor + 0.03f)) / (finalColor * (2.43f * finalColor + 0.59f) + 0.14f);
    fragColor = vec4(pow(finalColor, vec3(1.0f / 2.2f)), 1.0f);
}