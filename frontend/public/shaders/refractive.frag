#version 300 es
precision highp float;

#define MAX_LIGHTS 4
#define BOUNCES 3
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

uniform float u_time;
uniform vec3 u_cameraPos;
uniform samplerCube u_cube;
uniform float u_ior;
uniform vec3 u_absorptionColor;
uniform vec3 u_color;
uniform float u_aberrationStrength;
uniform float u_fresnelStrength;
uniform float u_opacity;

uniform PointLight u_pointLights[MAX_LIGHTS];
uniform int u_pointLightCount;
uniform DirLight u_dirLights[MAX_LIGHTS];
uniform int u_dirLightCount;
uniform SpotLight u_spotLights[MAX_LIGHTS];
uniform int u_spotLightCount;
uniform AmbientLight u_ambientLight;

in vec3 v_normal;
in vec3 v_worldPos;
out vec4 fragColor;

// --- FUNCIONES AUXILIARES ---

vec3 getFlatNormal() {
    vec3 fdx = dFdx(v_worldPos);
    vec3 fdy = dFdy(v_worldPos);
    return normalize(cross(fdx, fdy));
}

float getAttenuation(float dist, float range, float decay) {
    if(range > 0.0f && dist >= range)
        return 0.0f;
    return 1.0f / (1.0f + pow(dist, decay));
}

void main() {
    float pulse = 0.4f + 0.3f * sin(u_time * 2.0f + dot(v_worldPos, vec3(0.5f))) + 0.2f * sin(u_time * 3.5f + dot(v_worldPos, vec3(1.0f)));
    pulse = mix(0.6f, 1.0f, pulse);

    vec3 flatN = getFlatNormal();
    vec3 N = normalize(mix(v_normal, flatN, 0.7f));
    vec3 V = normalize(u_cameraPos - v_worldPos);
    float NdotV = max(dot(N, V), 0.0001f);

    vec3 R_ext = reflect(-V, N);

    vec3 refraction = vec3(0.0f);
    vec3 rayDirs[3];
    for(int i = 0; i < 3; i++) {
        float ior = u_ior + (float(i - 1) * u_aberrationStrength);
        vec3 rayDir = refract(-V, N, 1.0f / ior);
        rayDirs[i] = rayDir;

        vec3 internalAcc = vec3(0.0f);
        vec3 currentDir = rayDir;
        for(int b = 0; b < BOUNCES; b++) {
            internalAcc += textureLod(u_cube, currentDir, float(b) * 1.5f).rgb;
            currentDir = reflect(currentDir, flatN * (float(b + 1) * 0.5f));
        }
        refraction[i] = internalAcc[i] / float(BOUNCES);
    }

    vec3 totalSpecular = vec3(0.0f);
    vec3 totalInternalLight = vec3(0.0f);
    float totalLightFactor = 0.0f;

    for(int i = 0; i < u_dirLightCount && i < MAX_LIGHTS; i++) {
        vec3 L = normalize(-u_dirLights[i].direction);
        float NdotL = max(dot(N, L), 0.0f);
        vec3 lightCol = u_dirLights[i].color * u_dirLights[i].intensity;

        totalSpecular += lightCol * pow(max(dot(R_ext, L), 0.0f), 128.0f);
        for(int j = 0; j < 3; j++) totalInternalLight[j] += lightCol[j] * pow(max(dot(rayDirs[j], -L), 0.0f), 64.0f);
        totalLightFactor += u_dirLights[i].intensity * NdotL;
    }

    for(int i = 0; i < u_pointLightCount && i < MAX_LIGHTS; i++) {
        vec3 Lvec = u_pointLights[i].position - v_worldPos;
        float d = length(Lvec);
        vec3 L = normalize(Lvec);
        float NdotL = max(dot(N, L), 0.0f);
        float atten = getAttenuation(d, u_pointLights[i].distance, u_pointLights[i].decay);
        vec3 lightCol = u_pointLights[i].color * u_pointLights[i].intensity * atten;

        totalSpecular += lightCol * pow(max(dot(R_ext, L), 0.0f), 128.0f);
        for(int j = 0; j < 3; j++) totalInternalLight[j] += lightCol[j] * pow(max(dot(rayDirs[j], -L), 0.0f), 64.0f);
        totalLightFactor += u_pointLights[i].intensity * atten * NdotL;
    }

    for(int i = 0; i < u_spotLightCount && i < MAX_LIGHTS; i++) {
        vec3 Lvec = u_spotLights[i].position - v_worldPos;
        float d = length(Lvec);
        vec3 L = normalize(Lvec);
        float NdotL = max(dot(N, L), 0.0f);

        float theta = dot(L, normalize(-u_spotLights[i].direction));
        float epsilon = u_spotLights[i].cutoff - u_spotLights[i].outerCutoff;
        float spotAtten = clamp((theta - u_spotLights[i].outerCutoff) / epsilon, 0.0f, 1.0f);
        float atten = getAttenuation(d, u_spotLights[i].distance, u_spotLights[i].decay) * spotAtten;
        vec3 lightCol = u_spotLights[i].color * u_spotLights[i].intensity * atten;

        totalSpecular += lightCol * pow(max(dot(R_ext, L), 0.0f), 128.0f);
        for(int j = 0; j < 3; j++) totalInternalLight[j] += lightCol[j] * pow(max(dot(rayDirs[j], -L), 0.0f), 64.0f);
        totalLightFactor += u_spotLights[i].intensity * atten * NdotL;
    }

    float indirectIntensity = u_ambientLight.intensity + (totalLightFactor * 0.15f);
    indirectIntensity = clamp(indirectIntensity, 0.0f, 1.5f);

    vec3 absorb = exp(-u_absorptionColor * 1.5f);
    vec3 gemBaseColor = u_color * pulse;

    vec3 coloredRefraction = refraction * gemBaseColor * absorb * indirectIntensity;
    vec3 lightFire = totalInternalLight * gemBaseColor * (1.5f + pulse);

    float f0 = pow((u_ior - 1.0f) / (u_ior + 1.0f), 2.0f);
    float fresnel = f0 + (1.0f - f0) * pow(1.0f - NdotV, 5.0f);
    fresnel = clamp(fresnel * u_fresnelStrength, 0.0f, 1.0f);

    vec3 surfaceReflection = texture(u_cube, R_ext).rgb * indirectIntensity;

    vec3 interior = coloredRefraction + lightFire + (u_ambientLight.color * u_ambientLight.intensity * gemBaseColor);
    vec3 finalColor = mix(interior, surfaceReflection + totalSpecular, fresnel);

    float sparkle = pow(max(dot(R_ext, V), 0.0f), 128.0f) * u_fresnelStrength;
    finalColor += totalSpecular + (sparkle * pulse * indirectIntensity);

    finalColor = (finalColor * (2.51f * finalColor + 0.03f)) / (finalColor * (2.43f * finalColor + 0.59f) + 0.14f);
    finalColor = pow(finalColor, vec3(1.0f / 2.2f));

    fragColor = vec4(finalColor, u_opacity);
}