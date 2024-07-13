package APIs.ReaderAPI

import APIs.ReaderAPI.ReaderMessage

case class PurchaseMessage(
    userName: String,
    title: String,
    chapter: Int,
    cost: Int
) extends ReaderMessage[String]
