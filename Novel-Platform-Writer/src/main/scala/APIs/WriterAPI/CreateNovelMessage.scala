package APIs

import APIs.WriterAPI.WriterMessage

case class CreateNovelContentMessage(userName: String, title: String)
    extends WriterMessage[String]
