package APIs

import APIs.NovelMessage

case class AuditorFilterMessage(title: String, chapter: Int, keyword: String)
    extends NovelMessage[String]
