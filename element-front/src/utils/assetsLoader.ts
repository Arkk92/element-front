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
    const video = document.createElement("video");
    video.src = src;
    video.oncanplaythrough = () => resolve();
    video.onerror = (err) => reject(err);
  });
};

export const preloadAssets = (
  assetList: string[],
  onProgress: (loaded: number, total: number) => void
): Promise<void[]> => {
  let loaded = 0;
  const total = assetList.length;

  const updateProgress = () => {
    loaded += 1;
    onProgress(loaded, total); // Call the progress callback
  };

  return Promise.all(
    assetList.map((asset) => {
      if (asset.endsWith(".mp4")) {
        return preloadVideo(asset).then(updateProgress);
      } else {
        return preloadImage(asset).then(updateProgress);
      }
    })
  );
};