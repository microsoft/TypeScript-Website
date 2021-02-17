export const setupLikeDislikeButtons = (slug: string, i: any) => {
  const likeButton = document.getElementById("like-button")!
  const dislikeButton = document.getElementById("dislike-button")!
  if (!likeButton || !dislikeButton) return

  const clicked = (eventName: string) => () => {
    // @ts-ignore
    window.appInsights &&
      // @ts-ignore
      window.appInsights.trackEvent({
        name: eventName,
        properties: { slug: slug, ab: "a" },
      })

    const newContent: string = i("handb_thanks")
    const dislikeButton = document.getElementById("like-dislike-subnav")!
    dislikeButton.innerHTML = `<h5>${newContent}</h5>`
  }

  likeButton.onclick = clicked("Liked Page")
  dislikeButton.onclick = clicked("Disliked Page")
}
