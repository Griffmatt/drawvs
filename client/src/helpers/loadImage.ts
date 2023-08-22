export const loadImage = (url: string) => {
  const img = new Image();
  img.src = url;
  return img;
};
