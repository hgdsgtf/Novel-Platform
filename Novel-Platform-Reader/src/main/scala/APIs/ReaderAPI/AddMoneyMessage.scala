package APIs.ReaderAPI

import APIs.ReaderAPI.ReaderMessage

case class AddMoneyMessage(userName: String, addamount: Int)
    extends ReaderMessage[String]
