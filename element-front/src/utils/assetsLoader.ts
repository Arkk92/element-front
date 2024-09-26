export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
    });
  };
  
  export const preloadVideo = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = src;
      video.oncanplaythrough = () => resolve();
      video.onerror = (err) => reject(err);
    });
  };
  
  export const preloadAssets = (assetList: string[]): Promise<void[]> => {
    return Promise.all(
      assetList.map((asset) => {
        if (asset.endsWith('.mp4')) {
          return preloadVideo(asset); // Preload video if it's an MP4
        } else {
          return preloadImage(asset); // Preload image for other formats
        }
      })
    );
  };
  