package APIs.ReaderAPI

import APIs.ReaderAPI.ReaderMessage

case class DeleteNovelMessage(userName: String, title: String)
    extends ReaderMessage[String]
