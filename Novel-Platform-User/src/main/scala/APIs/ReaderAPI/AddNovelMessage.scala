package APIs.ReaderAPI

import APIs.ReaderAPI.ReaderMessage

case class AddNovelMessage(userName: String, title: String)
    extends ReaderMessage[String]
