package APIs

import APIs.NovelMessage

case class ReaderGetAccessMessage(userName: String, title: String, chapter: Int)
    extends NovelMessage[String]
