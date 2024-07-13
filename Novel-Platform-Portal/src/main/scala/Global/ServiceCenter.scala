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
  val auditorServiceCode = "A000005"
  val moneyServiceCode = "A000006"
  val novelServiceCode = "A000007"
  val commentServiceCode = "A000008"
  val adminServiceCode = "A000009"
  val styleServiceCode = "A000010"
  val basicUserServiceCode = "A000011"

  val fullNameMap: Map[String, String] = Map(
    dbManagerServiceCode -> "数据库管理（DB_Manager）",
    readerServiceCode -> "读者（Reader）",
    writerServiceCode -> "作者（Writer）",
    portalServiceCode -> "门户（Portal）",
    auditorServiceCode -> "审核者（Auditor）",
    moneyServiceCode -> "快乐豆（Money）",
    novelServiceCode -> "小说（Novel）",
    commentServiceCode -> "评论（Comment）",
    adminServiceCode -> "管理员（Admin）",
    styleServiceCode -> "风格（Style）",
    basicUserServiceCode -> "用户（BasicUser）"
  )

  val address: Map[String, String] = Map(
    "DB-Manager" -> "127.0.0.1:10001",
    "Reader" -> "127.0.0.1:10002",
    "Writer" -> "127.0.0.1:10003",
    "Portal" -> "127.0.0.1:10004",
    "Auditor" -> "127.0.0.1:10005",
    "Money" -> "127.0.0.1:10006",
    "Novel" -> "127.0.0.1:10007",
    "Comment" -> "127.0.0.1:10008",
    "Admin" -> "127.0.0.1:10009",
    "Style" -> "127.0.0.1:10010",
    "BasicUser" -> "127.0.0.1:10011"
  )
}
