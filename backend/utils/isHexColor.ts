function isHexColor(color) {
  const regex = /^#[0-9A-Fa-f]{6}$/;
  return regex.test(color);
}

export default isHexColor;
