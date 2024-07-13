package APIs

import APIs.NovelMessage

case class UpdateNovelContentMessage(
    title: String,
    chapter: Int,
    newContent: String,
    reason: String
) extends NovelMessage[String]
