package APIs

import APIs.NovelMessage

case class GetChapterMessage(title: String, chapter: Int)
    extends NovelMessage[String]
