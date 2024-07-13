package APIs

import APIs.NovelMessage

case class GetChapterPriceMessage(title: String, chapter: Int)
    extends NovelMessage[String]
