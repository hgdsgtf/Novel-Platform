package APIs.AdminAPI

case class UpdateClicksByDate(novelTitle: String, currentTime: String) extends AdminMessage[Int]

