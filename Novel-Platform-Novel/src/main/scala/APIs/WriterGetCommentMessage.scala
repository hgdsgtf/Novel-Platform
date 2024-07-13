package APIs

import APIs.NovelMessage

case class WriterGetCommentMessage(
    title: String,
    chapter: Int
) extends NovelMessage[String]
