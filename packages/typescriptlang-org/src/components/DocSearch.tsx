import React, { Fragment, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { Link, navigate } from "gatsby"
import {
  DocSearchButton,
  useDocSearchKeyboardEvents,
  DocSearchModalProps,
} from "@docsearch/react"

import "./DocSearch.scss"

let DocSearchModal: React.ComponentType<DocSearchModalProps> | null = null

function Hit({ hit, children }) {
  return <Link to={hit.url}>{children}</Link>
}

export function DocSearch(props) {
  const searchButtonRef = useRef<HTMLButtonElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | null>(null)

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve()
    }

    return Promise.all([
      import("@docsearch/react/modal"),
      import("@docsearch/react/style/modal"),
    ]).then(([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal
    })
  }, [])

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      setIsOpen(true)
    })
  }, [importDocSearchModalIfNeeded, setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (event: KeyboardEvent) => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true)
        setInitialQuery(event.key)
      })
    },
    [importDocSearchModalIfNeeded, setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <Fragment>
      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
        ref={searchButtonRef}
      />

      {DocSearchModal &&
        isOpen &&
        createPortal(
          <DocSearchModal
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            onClose={onClose}
            navigator={{
              navigate({ suggestionUrl }) {
                navigate(suggestionUrl)
              },
            }}
            hitComponent={Hit}
            transformItems={items => {
              return items.map(item => {
                // We transform the absolute URL into a relative URL to
                // leverage Gatsby's preloading.
                const a = document.createElement("a")
                a.href = item.url

                return {
                  ...item,
                  url: `${a.pathname}${a.hash}`,
                }
              })
            }}
            {...props}
          />,
          document.body
        )}
    </Fragment>
  )
}
