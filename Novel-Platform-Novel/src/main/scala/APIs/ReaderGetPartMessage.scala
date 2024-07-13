package APIs

import APIs.NovelMessage

case class ReaderGetPartMessage(title: String, chapter: Int)
    extends NovelMessage[String]
