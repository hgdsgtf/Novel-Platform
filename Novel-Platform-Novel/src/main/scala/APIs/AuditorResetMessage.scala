package APIs

import APIs.NovelMessage

case class AuditorResetMessage(title: String, chapter: Int)
    extends NovelMessage[String]
