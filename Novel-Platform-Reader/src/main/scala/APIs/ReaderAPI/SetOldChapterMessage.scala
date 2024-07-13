package APIs.ReaderAPI

import APIs.ReaderAPI.ReaderMessage

case class SetOldChapterMessage(userName: String, title: String, chapter: Int)
    extends ReaderMessage[String]
