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
        properties: { slug: slug, ab: "b" },
      })

    const newContent: string = i("handb_thanks")

    const textSectionNav = document.getElementById("like-dislike-subnav")!
    const popoverPopup = document.getElementById("page-helpful-popup")!

    textSectionNav.innerHTML = `<h5>${newContent}</h5>`
    popoverPopup.innerHTML = `<p>${newContent}</p>`
  }

  likeButton.onclick = clicked("Liked Page")
  dislikeButton.onclick = clicked("Disliked Page")

  const likeButtonPopup = document.getElementById("like-button-popup")!
  const dislikeButtonPopup = document.getElementById("dislike-button-popup")!
  likeButtonPopup.onclick = clicked("Liked Page")
  dislikeButtonPopup.onclick = clicked("Disliked Page")

  // Handles showing the "is this page helpful" when you've hit the end
  window.addEventListener(
    "scroll",
    () => {
      const body = document.body,
        html = document.documentElement

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )

      const y = Math.max(window.pageYOffset) + window.innerHeight
      const footerH = document.getElementById("site-footer")!.clientHeight
      const bottomOfWindow = y > height - footerH + 150

      const popup = document.getElementById("page-helpful-popup")
      const nav = document.getElementById("like-dislike-subnav")
      if (!popup) return
      if (!nav) return

      const popupOpacity = bottomOfWindow ? "1" : "0"
      if (popup.style.opacity != popupOpacity) {
        // popup.style.display = bottomOfWindow ? "block" : "none"
        popup.style.opacity = popupOpacity
      }

      const navOpacity = bottomOfWindow ? "0" : "1"
      if (nav.style.opacity != navOpacity) {
        nav.style.opacity = navOpacity
      }
    },
    { passive: true, capture: true }
  )
}
