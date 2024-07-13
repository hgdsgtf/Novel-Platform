package Global

import Global.GlobalVariables.serviceCode
import cats.effect.IO
import com.comcast.ip4s.Port
import org.http4s.Uri

object ServiceCenter {
  val projectName: String = "APP"

  val dbManagerServiceCode = "A000001"
  val readerServiceCode = "A000002"
  val writerServiceCode = "A000003"
  val portalServiceCode = "A000004"
  val novelServiceCode = "A000005"
  val commentServiceCode = "A000008"

  val fullNameMap: Map[String, String] = Map(
    dbManagerServiceCode -> "数据库管理（DB_Manager）",
    readerServiceCode -> "读者（Reader）",
    writerServiceCode -> "作者（Writer）",
    portalServiceCode -> "门户（Portal）",
    novelServiceCode -> "小说（Novel）",
    commentServiceCode -> "评论（Comment）"

  )

  val address: Map[String, String] = Map(
    "DB-Manager" -> "127.0.0.1:10001",
    "Reader" -> "127.0.0.1:10002",
    "Writer" -> "127.0.0.1:10003",
    "Portal" -> "127.0.0.1:10004",
    "Novel" -> "127.0.0.1:10005",
    "Comment" -> "127.0.0.1:10008"

  )
}
