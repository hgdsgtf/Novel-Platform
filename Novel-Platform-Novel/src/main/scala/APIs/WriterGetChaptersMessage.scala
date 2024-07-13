package APIs

import APIs.NovelMessage

case class WriterGetChaptersMessage(title: String) extends NovelMessage[String]
