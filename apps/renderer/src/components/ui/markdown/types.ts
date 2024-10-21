export type MarkdownImage = {
  url: string
  blurhash?: string
  width: number
  height: number
}

export interface MarkdownRenderActions {
  transformUrl: (url?: string) => string
  isAudio: (url?: string) => boolean
  ensureAndRenderTimeStamp: (children: string) => React.ReactNode
}
