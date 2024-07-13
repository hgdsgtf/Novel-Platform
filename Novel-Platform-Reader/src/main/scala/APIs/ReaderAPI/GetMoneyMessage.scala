package APIs.ReaderAPI

import APIs.ReaderAPI.ReaderMessage

case class GetMoneyMessage(userName: String) extends ReaderMessage[String]
