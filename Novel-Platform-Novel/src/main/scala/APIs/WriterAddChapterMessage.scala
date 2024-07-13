package APIs

import APIs.NovelMessage

case class WriterAddChapterMessage(
    title: String,
    author: String,
    chapter: Int,
    chapterName: String,
    content: String
) extends NovelMessage[String]
