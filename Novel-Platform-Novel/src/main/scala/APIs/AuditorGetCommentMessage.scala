package APIs

import APIs.NovelMessage

case class AuditorGetCommentMessage(
    title: String,
    chapter: Int
) extends NovelMessage[String]
