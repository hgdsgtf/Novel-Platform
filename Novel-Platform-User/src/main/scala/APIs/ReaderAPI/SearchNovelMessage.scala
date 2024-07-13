package APIs

import APIs.ReaderAPI.ReaderMessage

case class SearchNovelMessage(title: String) extends ReaderMessage[String]
