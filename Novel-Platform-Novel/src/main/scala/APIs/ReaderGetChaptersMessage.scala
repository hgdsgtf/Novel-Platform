package APIs

import APIs.NovelMessage

case class ReaderGetChaptersMessage(title: String, userName: String)
    extends NovelMessage[String]
