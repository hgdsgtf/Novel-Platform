package APIs

import APIs.NovelMessage

case class AuditorApproveChapterMessage(title: String, chapter: Int)
    extends NovelMessage[String]
