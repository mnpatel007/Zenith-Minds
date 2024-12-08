export async function shareContent(shareData) {
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    return await navigator.share(shareData);
  }
  throw new Error('Web Share API not supported');
}