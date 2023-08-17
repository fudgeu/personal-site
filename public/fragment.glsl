precision mediump float;

struct PointLight {
  vec3 position;
  vec3 ambientColor;
  vec3 diffuseColor;
  float lightConstant;
  float lightLinear;
  float lightQuadratic;
};

varying highp vec3 vNormal;
varying highp vec3 vFragPos;

vec3 calculatePointLight(PointLight light, vec3 normal, vec3 fragmentPos) {
  vec3 lightDirection = normalize(light.position - fragmentPos);
  float difference = max(dot(normal, lightDirection), 0.0);

  // attenuation //
  float distance = length(light.position - fragmentPos);
  float attenuation = 1.0 / (light.lightConstant + light.lightLinear * distance + light.lightQuadratic * (distance * distance));

  vec3 diffuse = light.diffuseColor * difference * attenuation;
  vec3 ambient = light.ambientColor * attenuation;

  return ambient + diffuse;
}

void main(void) {
  vec3 norm = normalize(vNormal);

  PointLight purpleLight = PointLight(vec3(-5.0, -5.0, 5.0), vec3(0.2, 0.2, 0.2), vec3(0.59, 0, 1), 1.0, 0.05, 0.005);
  PointLight blueLight = PointLight(vec3(5.0, 5.0, 5.0), vec3(0.2, 0.2, 0.2), vec3(0, 0.14, 0.37), 1.0, 0.05, 0.005);

  vec3 lightCalc1 = calculatePointLight(purpleLight, norm, vFragPos);
  vec3 lightCalc2 = calculatePointLight(blueLight, norm, vFragPos);

  gl_FragColor = vec4(lightCalc1 + lightCalc2, 1.0);
}