export const isDesktop = () => {
    const userAgent = window.navigator.userAgent.toLocaleLowerCase();
    return !(
        /mobile|android|iphone|ipad|ipod|windows phone/i.test(userAgent)
      );
}