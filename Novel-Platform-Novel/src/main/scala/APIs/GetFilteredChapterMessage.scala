package APIs

import APIs.NovelMessage

case class GetFilteredChapterMessage(title: String, chapter: Int)
    extends NovelMessage[String]
