package APIs.AdminAPI

case class UpdateClicks(readerName: String, novelTitle: String, currentTime: String) extends AdminMessage[Int]
