export const isDesktop = () => {
    const userAgent = window.navigator.userAgent.toLocaleLowerCase();
    return !(
        /mobile|android|iphone|ipad|ipod|windows phone/i.test(userAgent)
      );
}

export const base64ToFile = (base64String: string, fileName: string): File => {
 
  const [metadata, data] = base64String.split(","); 
   const mimeType = metadata.match(/:(.*?);/)?.[1] || "image/png";
  const byteCharacters = atob(data); 
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
 
  return new File([byteArray], fileName, { type: mimeType });
};



